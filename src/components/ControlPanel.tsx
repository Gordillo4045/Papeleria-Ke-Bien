import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
//import {db, storage} from "../Config/Config"
export default function App() {

  const [title,setTitle] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [price,setPrice] = useState('')
  const [image, setImage] = useState(null)

  const [imageError, setImageError] = useState('')

  const [successMsg, setSucessMsg] = useState('')
  const [uploadError, setUploadError] = useState('')
const types = ['image/jpg','image/jpeg','image/png','image/PNG']
// @ts-ignore
  const handleProductImg = (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0]
    if(selectedFile){
      if(selectedFile&&types.includes(selectedFile.type)){
        setImage(selectedFile)
        setImageError('')
      }else{
        setImage(null)
        setImageError('Selecciona un tipo valido jpg o png')
      }
    }else{
      console.log('porfavor selecciona el archivo')
    }  
 }
// @ts-ignore
 const handleAddProducts=(e)=>{
  e.preventDefault();
  // console.log(title,marca,modelo,price)
  // console.log(image)
  //const uploadTask=storage.ref(`product-images/${image.name}`).put(image)
 }
  
  return (
    <div className="bg-gray-50">
      <div className="lg:w-9/12 flex flex-col items-center justify-center m-auto bg-gray-50">
      <h1 className="text-4xl font-bold">Añadir productos</h1>
      {successMsg&&<>
      <div className="sucess-msg">{successMsg}</div>
      </>}
        <form action="" onSubmit={handleAddProducts} className="flex flex-col bg-gray-50 h-screen w-full items-center space-y-14 p-6">
          <Input
            isRequired
            type="text"
            label="Nombre"
            labelPlacement="outside"
            placeholder="Cuaderno"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Input
            isRequired
            type="text"
            label="Marca"
            labelPlacement="outside"
            placeholder="Bazic"
            onChange={(e) => setMarca(e.target.value)}
            value={marca}
          />
          <Input
            isRequired
            type="text"
            label="Modelo"
            labelPlacement="outside"
            placeholder="Cuadro"
            onChange={(e) => setModelo(e.target.value)}
            value={modelo}
          />
          <Input
            isRequired
            type="number"
            label="Precio"
            placeholder="0.00"
            labelPlacement="outside"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <Input
            isRequired
            type="file"
            label="Imagen"
            placeholder="Selecciona el archivo"
            labelPlacement="outside"
            onChange={handleProductImg}
          />
          {imageError&&<>
            <div className="error-msg">{imageError}</div>
            <br />
          </>}
          <Button color="success" type="submit" >
            Aceptar
          </Button>
        </form>
        {uploadError&&<>
          <br />
            <div className="error-msg">{uploadError}</div>
            
          </>}
      </div>
    </div>
  )
}