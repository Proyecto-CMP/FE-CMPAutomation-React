import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Fragment } from "react";
import { useState } from 'react'
import { Checkbox } from '@mui/material';
import Select from 'react-select';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FormPeriodo = () => {
  const [ncontrato, setNcontrato] = useState("")
  const [fileName, setFileName] = useState("")
  const test = () => {
    console.log(ncontrato)
    console.log(checkboxOptions)
    console.log(fileName)
    console.log(dateValue)
  }

  const [dateValue, setDateValue] = useState(new Date());

  const [checkboxOptions, setcheckboxOptions] = useState([{ name: "Numero de contrato sin faenas", value: false }])


  const ncontradoDataStatic = [
    { value: '123456789', label: '123456789' },
    { value: '987654321', label: '987654321' }
  ];

  // useState waiting for ncontrato to change
  useEffect(() => {
    if (ncontrato.value === "123456789") {
      setcheckboxOptions([
        { name: "Guacolda", value: false },
        { name: "Cerro Negro Norte", value: false }])
    }
    if (ncontrato.value === "987654321") {
      setcheckboxOptions([
        { name: "Mina Los Colorados", value: false },
        { name: "Romeral", value: false }])
    }
  }, [ncontrato])



  return (
    <>

      <Card className="w-96 bg-gray-200" >
        <CardHeader
          variant="gradient"
          color='blue'
          className="mb-4 grid h-28 place-items-center p-2"
        >
          <Typography variant="h3" color="white">
            Formulario para abrir periodo
          </Typography>
          <Typography variant="h5" color="white">
            Seleccionar faenas donde se abrira el periodo
          </Typography>
          <Typography variant="h6" color="white">
            Se debe subir el archivo excel 97-2003 (.xls)
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Select
            placeholder="Seleccione un numero de contrato"
            value={ncontrato}
            onChange={setNcontrato}
            options={ncontradoDataStatic}
          />
          {ncontrato ? (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
              <DatePicker

                views={['month', 'year',]}
                label="Mes y año"
                minDate={dayjs('2022-03-01')}
                maxDate={dayjs('2022-10-01')}
                value={dateValue}
                onChange={(newValue) => {
                  setDateValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
            </LocalizationProvider>
          ) : null}


          {ncontrato ? (
            <Fragment>
              {
                checkboxOptions.map((option, index) => {
                  return (
                    <div key={index}>
                      <Checkbox
                        checked={checkboxOptions[index].value}
                        onChange={() => {
                          let newCheckboxOptions = [...checkboxOptions];
                          newCheckboxOptions[index].value = !newCheckboxOptions[index].value;
                          setcheckboxOptions(newCheckboxOptions);
                        }}
                      /> {option.name}
                    </div>
                  )
                })
              }
            </Fragment>
          ) : null}


          {ncontrato ? (
            <Input
              type="file"
              accept=".xls"
              onChange={(e) => {
                //if e.target.files is not empty
                if (e.target.files.length > 0) {
                  setFileName(e.target.files[0].name)
                }
              }}
            />
          ) : null}
        </CardBody>

        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth onClick={test}>
            Enviar Formulario
          </Button>
          <Typography variant="small" color="black"  >
            A partir de ahora, todas las funciones para realizar la carga de información seran bloqueadas entre los dias 21 al 25 de cada mes, favor realizar la carga de información completa ya que en estas fechas señaladas no podrá regularizar la carga.
          </Typography>
        </CardFooter>
      </Card>

    </>
  )
}

export default FormPeriodo
