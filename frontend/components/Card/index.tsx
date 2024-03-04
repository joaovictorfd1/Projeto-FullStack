import React, { Dispatch, SetStateAction } from 'react'
import { Stack, Typography, Rating, Grid } from '@mui/material'
import { ICourse } from '../../interfaces/ICourse'
import Image from 'next/image'
import { formatCurrency, formatPercent } from '../../utils/formaters/formaters'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

interface ICourseCard {
  course: ICourse
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>
  setId: Dispatch<SetStateAction<number>>
}

const CourseCard: React.FC<ICourseCard> = ({ course, setDeleteModalOpen, setId }) => {
  const router = useRouter();
  return (
    <Grid item>
      <Stack sx={{ transition: 'all 0.3s', cursor: 'pointer', '&:hover': { background: '#FFF' } }} padding='8px' borderRadius='12px' gap='4px'>
        <Image src={course.thumbnail} alt='course_image' width={150} height={150} priority style={{ borderRadius: '4px' }} />
        <Typography>{course.title}</Typography>
        <Stack direction='row' gap={1} alignItems='center'>
          <Rating value={course.rating} readOnly precision={0.1} />
          <Typography fontSize='12px' color='grey.500'>({course.stock} restantes)</Typography>
        </Stack>
        <Stack direction='row' gap={1}>
          <Typography color='primary' fontWeight={700}>{formatCurrency(course.price)}</Typography>
          <Typography
            color='grey.800'
            fontWeight={700}
            sx={(theme) => ({
              padding: '0px 8px',
              borderRadius: '4px',
              background: theme.palette.secondary.main
            })}
          >
            - {formatPercent(course.discountPercentage)}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={1}>
          <Stack component={'div'} display={'flex'} onClick={() => router.push(`/course/${course.id}`)}>
            <EditIcon sx={{ cursor: 'pointer', color: '#1976d2' }} />
          </Stack>
          <Stack component={'div'} display={'flex'} onClick={() => {
            setDeleteModalOpen(true)
            setId(course.id)
          }}>
            <DeleteIcon sx={{ cursor: 'pointer', color: 'red' }} />
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  )
}

export default CourseCard