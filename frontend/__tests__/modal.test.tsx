import '@testing-library/jest-dom'
import { render, screen, act, fireEvent } from '@testing-library/react'
import Modal from '../components/Modal/Modal'

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
  it('Ler todos os campos e mudar valores para login', async () => {
    render(
      <Modal
        handleClose={() => (false)}
        open={true}
        getAllCourse={() => (null)}
      />
    )

    let inputImg = screen.getByTestId("image");
    expect(inputImg).toBeInTheDocument()
    let inputTitle = screen.getByPlaceholderText("Titulo");
    expect(inputTitle).toBeInTheDocument()
    let inputBrand = screen.getByPlaceholderText("Marca");
    expect(inputBrand).toBeInTheDocument()
    // let inputCategory = screen.getByTestId("category");
    // expect(inputCategory).toBeInTheDocument()
    let inputDescription = screen.getByPlaceholderText("Descrição");
    expect(inputDescription).toBeInTheDocument()
    let inputPrice = screen.getByPlaceholderText("Preço");
    expect(inputPrice).toBeInTheDocument()
    let inputDiscount = screen.getByPlaceholderText("Desconto");
    expect(inputDiscount).toBeInTheDocument()
    let inputRating = screen.getByPlaceholderText("Avaliação");
    expect(inputRating).toBeInTheDocument()
    let inputStock = screen.getByPlaceholderText("Estoque");
    expect(inputStock).toBeInTheDocument()
    let buttonCreate = screen.getByTestId("createButton");
    expect(buttonCreate).toBeInTheDocument()
    let buttonCancel = screen.getByTestId("cancelButton");
    expect(buttonCancel).toBeInTheDocument()

    // const file = new File(["https://beta-project-teste.vercel.app/8ce7d863-f362-40ff-904f-c8863213102b"], 'arquivo.txt', { type: 'text/plain' });
    // await act(async () => {
    //   fireEvent.click(inputCategory);
    // })

    // await act(async () => {
    //   fireEvent.click(screen.getByLabelText("Desenvolvimento Web"));
    // })
    await act(async () => {
      // fireEvent.change(inputImg, {
      //   target: { files: [file] },
      // });
      fireEvent.change(inputTitle, { target: { value: "Title Teste" } });
      fireEvent.change(inputBrand, { target: { value: "Origamid" } });
      fireEvent.change(inputDescription, { target: { value: "Teste descrição" } });
      fireEvent.change(inputPrice, { target: { value: 20 } });
      fireEvent.change(inputDiscount, { target: { value: 20 } });
      fireEvent.change(inputRating, { target: { value: 10 } });
      fireEvent.change(inputStock, { target: { value: 20 } });
      fireEvent.click(buttonCreate)
    })
  })
})