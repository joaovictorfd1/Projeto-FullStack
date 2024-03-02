import React, { useEffect, useState } from "react";
import { Backdrop, Button, Grid, Modal, Stack } from "@mui/material";
import { IProduct } from "../../interfaces/IProduct";
import { useFormik } from "formik";
import { ProductSchema } from "../../utils/validators/schemas";
import {
  FormContainer,
  Input,
  ModalContainer,
  ModalContent,
  ModalTitle,
  PreviewImage,
} from "./style";
import ImageInput from "../ImageInput/ImageInput";

interface IProductModal {
  open: boolean;
  handleClose: () => void;
  product: IProduct | null;
}

const initialValues: IProduct = {
  title: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: "",
  category: [],
  thumbnail: "",
  images: [],
};

export default function ProductModal({
  open,
  handleClose,
  product,
}: IProductModal) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [priceInputValue, setPriceInputValue] = useState<string>("");
  const token = localStorage.getItem('token')

  const onSubmit = async (values: IProduct) => {
    try {
      // if (product && token && productId) {
      //   await editProduct(token, values, productId);
      // } else if (token) {
      //   await addProduct(info.token, values);
      // }
      // handleClose();
    } catch (error) {
      handleClose();
    }
  };


  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: ProductSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(url);
      formik.setValues({
        ...formik.values,
        images: [url],
      });
    }
  }, [selectedImage]);

  useEffect(() => {
    if (product) {
      setImageUrl(product.images[0]);
      const numericValue = product.price / 100;
      const formattedValue = numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      formik.setValues({
        ...product,
      });
      setPriceInputValue(formattedValue);
    }
  }, [product]);

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event?.target.value;
    const numeric = parseInt(rawValue.replace(/[^0-9]/g, ""), 10) / 100;
    if (Number.isNaN(numeric)) {
      return;
    }
    const formattedValue = numeric.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setPriceInputValue(formattedValue);
    formik.setFieldValue("preco", numeric.toFixed(2).toString());
  };

  const title = product ? "Editar Produto" : "Criar Produto";

  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <ModalContainer>
        <ModalContent>
          <Stack>
            <ModalTitle>{title}</ModalTitle>
            <FormContainer container spacing={2}>
              {imageUrl && (
                <Grid item xs={12} display="flex" justifyContent="center">
                  <PreviewImage src={imageUrl} alt="preview" />
                </Grid>
              )}
              <Grid item xs={12} display="flex" justifyContent="center">
                <ImageInput onChange={setSelectedImage} />
              </Grid>
              <Grid item xs={12}>
                <Input
                  id="nome"
                  label="Nome"
                  variant="outlined"
                  type="text"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="nome"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  id="marca"
                  label="Marca"
                  variant="outlined"
                  type="text"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="marca"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  id="preco"
                  label="Preço"
                  variant="outlined"
                  type="text"
                  value={priceInputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePrice(e)
                  }
                  onBlur={formik.handleBlur}
                  name="preco"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  id="estoque"
                  label="Estoque"
                  variant="outlined"
                  type="number"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="qt_estoque"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  id="vendas"
                  label="Vendas"
                  variant="outlined"
                  type="number"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="qt_vendas"
                />
              </Grid>
              <Grid item xs={6} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ width: `200px` }}
                  onClick={() => formik.handleSubmit()}
                  disabled={!formik.isValid || !formik.dirty}
                >
                  Concluir
                </Button>
              </Grid>
              <Grid item xs={6} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ width: `200px` }}
                  onClick={() => handleClose()}
                  color="error"
                >
                  Cancelar
                </Button>
              </Grid>
            </FormContainer>
          </Stack>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}