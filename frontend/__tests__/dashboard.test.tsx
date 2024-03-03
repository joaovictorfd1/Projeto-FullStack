import '@testing-library/jest-dom'
import { render, screen, act, fireEvent } from '@testing-library/react'
import ListCourses from '../pages/dashboard'

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
  useParams() {
    return {
      prefetch: () => null
    };
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cb) => cb(),
}));

describe('Page', () => {
  it('Listagem de Produtos', async () => {
    render(<ListCourses />)

    let inputSearch = screen.getByTestId("search");
    expect(inputSearch).toBeInTheDocument()
    let selectOrder = screen.getByTestId("order");
    expect(selectOrder).toBeInTheDocument()
    let buttonNew = screen.getByTestId("new");
    expect(buttonNew).toBeInTheDocument()

    // await act(async () => {
    //   fireEvent.change(inputEmail, { target: { value: "teste@example.com" } });
    //   fireEvent.change(inputPassword, { target: { value: "password123456" } });
    //   fireEvent.click(buttonRegister)
    // })
  })
})