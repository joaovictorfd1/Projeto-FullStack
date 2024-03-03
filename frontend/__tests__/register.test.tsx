import '@testing-library/jest-dom'
import { render, screen, act, fireEvent } from '@testing-library/react'
import SignUp from '../pages/register'

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

describe('Page', () => {
  it('Ler todos os campos e mudar valores para registro', async () => {
    render(<SignUp />)

    let inputEmail = screen.getByPlaceholderText("Email");
    expect(inputEmail).toBeInTheDocument()
    let inputPassword = screen.getByPlaceholderText("Senha");
    expect(inputPassword).toBeInTheDocument()
    let buttonRegister = screen.getByTestId("registerButton");
    expect(buttonRegister).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: "teste@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "password123456" } });
      fireEvent.click(buttonRegister)
    })
  })
})