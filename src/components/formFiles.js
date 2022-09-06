import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button
} from "@material-tailwind/react";
import { Fragment } from "react";
import { useState } from 'react'
import { Checkbox, Icon } from '@mui/material';
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
    const [fileCounter, setFileCounter] = useState([])
    const [generalFilesCounter, setGeneralFilesCounter] = useState(0)
    const [fileTypes, setFileTypes] = useState([])
    const [generalFileType, setGeneralFileType] = useState([])

    var GeneralFileTypeAux = []
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

    const fileTypeDataStatic = [
        { value: "Anexos de traslado", label: "Anexos de traslado" },
        { value: "Certificado de cumplimiento de obligaciones laborales (F30-1)", label: "Certificado de cumplimiento de obligaciones laborales (F30-1)" },
        { value: "test", label: "test" }
    ]

    // useState waiting for ncontrato to change
    useEffect(() => {
        if (ncontrato.value === "123456789") {
            setcheckboxOptions([
                { name: "Guacolda", value: false },
                { name: "Cerro Negro Norte", value: false },
                { name: "Planta Pellets", value: false },
                { name: "Faena 2", value: false },
                { name: "Faena 3", value: false },
                { name: "Faena 4", value: false }])
        }
        if (ncontrato.value === "987654321") {
            setcheckboxOptions([
                { name: "Mina Los Colorados", value: false },
                { name: "Romeral", value: false }])
        }
    }, [ncontrato])

    // useEffect if chekboxOptions change, clear fileNames
    useEffect(() => {
        setFileNames([])
    }, [checkboxOptions])

    // useState waiting for checkboxOptions to change to add counter to saveFileCounter
    useEffect(() => {
        let saveFileCounter = []
        checkboxOptions.map((item, index) => (
            saveFileCounter.push({ id: index, counter: 0 })
        ))
        setFileCounter(saveFileCounter)
    }, [checkboxOptions])

    return (
        <>
            <Card className="w-96 bg-gray-200" >
                <CardHeader
                    variant="gradient"
                    color='blue'
                    className="mb-4 grid h-28 place-items-center p-2"
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
                            <Icon
                                icon="close"
                                color="warning"
                                className="cursor-pointer"
                                children="Agregar archivo"
                                onClick={() => {
                                    let newFileCounter = generalFilesCounter;
                                    newFileCounter += 1;
                                    setGeneralFilesCounter(newFileCounter)
                                    GeneralFileTypeAux = [...generalFileType];
                                    GeneralFileTypeAux.push({ id: generalFilesCounter, filetype: "" })
                                    setGeneralFileType(GeneralFileTypeAux)
                                }}>add_circle</Icon>
                            {generalFileType.map((item, index) => (
                                <>
                                    <Select
                                        key={index}
                                        placeholder="Seleccione un tipo de archivo"
                                        value={item.filetype}
                                        onChange={(newValue) => {
                                            let newGeneralFileType = [...generalFileType];
                                            newGeneralFileType[index].filetype = newValue;
                                            setGeneralFileType(newGeneralFileType);
                                        }}
                                        options={fileTypeDataStatic}
                                    />
                                    <Input type="file" multiple accept="*" onChange={(e) => {
                                        let newFileNames = [...fileNames];
                                        // append all checkboxOptions.name to a variable
                                        checkboxOptions.forEach((option) => {
                                            if (option.value) {
                                                for (let i = 0; i < e.target.files.length; i++) {
                                                    newFileNames.push(option.name + "|" + e.target.files[i].name)
                                                }
                                            }
                                        })
                                        setFileNames(newFileNames)
                                    }} />
                                </>
                            ))}
                        </>
                    ) : null}

                    {checkboxOptions.map((option, index) => {
                        return (
                            <Fragment key={index}>
                                {option.value ? (
                                    <>
                                        <Typography variant="h6" color="black">
                                            Archivos que se subiran a la faena: {option.name}
                                        </Typography>
                                        <Icon
                                            icon="close"
                                            color="info"
                                            className="cursor-pointer"
                                            children="Agregar archivo"
                                            key={index}
                                            onClick={() => {
                                                let newFileCounter = [...fileCounter];
                                                newFileCounter[index].counter += 1;
                                                setFileCounter(newFileCounter)
                                                //Push newFiletype to fileTypes
                                                let newFileTypes = [...fileTypes];
                                                newFileTypes.push({ id: index, filetype: "", counter: newFileCounter[index].counter })
                                                setFileTypes(newFileTypes)

                                            }}>add_circle</Icon>
                                        {fileCounter.filter(item => item.id === index).map((item2, index2) => {
                                            let array = []
                                            //for each fileCounter > 0 push to array
                                            let tempTypes = fileTypes.filter(item => item.id === index)

                                            for (let i = 0; i < item2.counter; i++) {
                                                array.push(
                                                    <>
                                                        <Select
                                                            key={Math.random()}
                                                            placeholder="Seleccione un tipo de archivo"
                                                            value={tempTypes[i].filetype}
                                                            onChange={(newValue) => {
                                                                let newFileTypes = [...fileTypes];
                                                                newFileTypes.find(item => item.id === index && item.counter === tempTypes[i].counter).filetype = newValue;
                                                                setFileTypes(newFileTypes);
                                                            }}
                                                            options={fileTypeDataStatic}
                                                        />
                                                        {fileTypes[i].filetype && <Input size="md" multiple key={(i)} type="file" accept="*" onChange={(e) => {
                                                            let newFileNames = [...fileNames];
                                                            for (let k = 0; k < e.target.files.length; k++) {
                                                                let aux = fileTypes.findIndex(item => item.id === index && item.counter === tempTypes[i].counter)

                                                                //If e.target.files is empty, disable button

                                                                newFileNames.push(fileTypes[aux].filetype.value + "|" + option.name + "|" + e.target.files[k].name)
                                                            }
                                                            setFileNames(newFileNames)
                                                        }} />
                                                        }
                                                    </>
                                                )
                                            }
                                            return array
                                        }
                                        )}
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
