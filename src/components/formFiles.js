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

const FormFiles = () => {
    const [ncontrato, setNcontrato] = useState("")
    const [fileNames, setFileNames] = useState([])
    const [multifileNames, setMultiFileNames] = useState([])
    const test = () => {
        console.log(ncontrato)
        console.log(checkboxOptions)
        console.log(fileNames)
        console.log(dateValue)
    }

    const [dateValue, setDateValue] = useState(new Date());

    const [checkboxOptions, setcheckboxOptions] = useState([{ name: "Número de contrato sin faenas", value: false }])


    const ncontradoDataStatic = [
        { value: '123456789', label: '123456789' },
        { value: '987654321', label: '987654321' }
    ];

    // useState waiting for ncontrato to change
    useEffect(() => {
        if (ncontrato.value === "123456789") {
            setcheckboxOptions([
                { name: "Guacolda", value: false },
                { name: "Cerro Negro Norte", value: false },
                { name: "Planta Pellets", value: false },
                { name: "Guacolda", value: false },
                { name: "Cerro Negro Norte", value: false },
                { name: "Planta Pellets", value: false }])
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
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white">
                        Subir archivos a múltiples faenas
                    </Typography>
                    <Typography variant="h6" color="white">
                        Seleccionar faenas donde se subirán los archivos
                    </Typography>

                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Select
                        placeholder="Seleccione un número de contrato"
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

                    {/* if two or more  checkboxOptions.value equals true */}
                    {ncontrato && checkboxOptions.filter(option => option.value === true).length >= 2 ? (
                        <>
                            <Typography variant="h6" color="black">
                                Archivos que se subiran a todas las faenas seleccionadas
                            </Typography>
                            <Input type="file" accept="*" multiple onChange={(e) => {

                                let newFileNames = [...fileNames];
                                // append all checkboxOptions.name to a variable
                                let faenas = ""
                                checkboxOptions.forEach((option) => {
                                    if (option.value) {
                                        faenas += option.name + "|"
                                    }
                                })
                                for (let i = 0; i < e.target.files.length; i++) {
                                    newFileNames.push(faenas + e.target.files[i].name)
                                }
                                setMultiFileNames(newFileNames)
                            }} />
                        </>
                    ) : null}


                    {/* render input type file for each value true in array checkboxOptions and append to array fileNames */}
                    {checkboxOptions.map((option, index) => {
                        return (
                            <Fragment key={index}>
                                {option.value ? (
                                    <>
                                        <Typography variant="h6" color="black">
                                            Archivos que se subiran a la faena: {option.name}
                                        </Typography>
                                        <Input type="file" accept="*" multiple onChange={(e) => {

                                            let newFileNames = [...fileNames];
                                            //For each file in e.target.files append to newFileNames
                                            for (let i = 0; i < e.target.files.length; i++) {
                                                newFileNames.push(option.name + "|" + e.target.files[i].name)
                                            }
                                            setFileNames(newFileNames)

                                        }} />
                                    </>
                                ) : null}
                            </Fragment>
                        )
                    })}


                </CardBody>
                <CardFooter className="pt-0">


                    <Button variant="gradient" fullWidth onClick={test}>
                        Enviar Formulario
                    </Button>
                </CardFooter>
            </Card>

        </>
    )
}

export default FormFiles
