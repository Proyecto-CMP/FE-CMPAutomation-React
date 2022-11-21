import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
    Progress,
    Alert
} from "@material-tailwind/react";
import { Fragment } from "react";
import { useState } from 'react'
import { Checkbox, Icon, CircularProgress } from '@mui/material';
import Select from 'react-select';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery, gql } from '@apollo/client';

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

//Apollo Client query
const obtenerContratosRut = gql`
    query obtenerContratosRut ($rut : String!){
        obtenerContratosRut (rut : $rut){
        rut
        contratos{
            name
                fecha_inicio
                fecha_termino
            divisiones{
                name
            }
        }
        }
    }
`


const FormFiles = () => {
    const [ncontrato, setNcontrato] = useState('')
    const [fileNames, setFileNames] = useState([])
    const [fileCounter, setFileCounter] = useState([])
    const [generalFilesCounter, setGeneralFilesCounter] = useState(0)
    const [fileTypes, setFileTypes] = useState([])
    const [generalFileType, setGeneralFileType] = useState([])
    const [progress, setProgress] = useState(0)
    const [errorUploading, setErrorUploading] = useState(false)
    const [LoadingState, setLoadingState] = useState(false);
    const [ncontratoOptions, setNcontratoOptions] = useState([{ value: "000000", label: "Sin contratos" }])
    const [dateValue, setDateValue] = useState(new Date());
    const [checkboxOptions, setcheckboxOptions] = useState([{ name: "Número de contrato sin faenas", value: false }])
    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    const s3Client = new S3Client({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET,
        },
    });
    
    
    var cont = 0
    var GeneralFileTypeAux = []

    //get rut from localstorage token
    const rut = localStorage.getItem('token').split('.')[1]
    const rutDecoded = JSON.parse(atob(rut))
    const rutUser = rutDecoded.rut

    //Apollo client useQuery
    const { data } = useQuery(obtenerContratosRut, {
        variables: {
            rut: rutUser
            }
            });
    
    //console.log("RutData",data.obtenerContratosRut.contratos)

    //Assign data.obtenerContratosRut.contratos to ncontratoOptions
    useEffect(() => {
        if (data) {
            //console.log(data)
            if(data.obtenerContratosRut  != null){
            let ncontratoOptionsAux = []
            data.obtenerContratosRut.contratos.forEach((contrato) => {
                ncontratoOptionsAux.push({ value: contrato.name, label: contrato.name })
            })
            setNcontratoOptions(ncontratoOptionsAux)
            }
        }
    }, [data])


    //Assign data.obtenerContratosRut.contratos.divisiones to CheckboxOptions based on ncontrato

    useEffect(() => {
        if (data) {
            if(data.obtenerContratosRut != null){
                let checkboxOptionsAux = []

                //filter in data to get the selected ncontrato and assign it to checkboxOptions
                data.obtenerContratosRut.contratos.forEach((contrato) => {
                        if (contrato.name === ncontrato.value){
                            //set minDate and maxDate
                            setDateValue(new Date())
                            setMinDate(contrato.fecha_inicio)
                            setMaxDate(contrato.fecha_termino)
                            contrato.divisiones.forEach((division) => {
                                checkboxOptionsAux.push({ value: false, name: division.name })
                            })
                        }
                })
                setcheckboxOptions(checkboxOptionsAux)
            }
        }
    }, [ncontrato, data])

    const token = localStorage.getItem('token')
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedValue = JSON.parse(window.atob(base64));

    const sendfile = () => {
        // console.log(ncontrato)
        // console.log(checkboxOptions)
        // console.log(fileNames)
        // console.log(dateValue)
        //Length of fileNames
        let s3Counter = fileNames.length
        setProgress(0)
        setLoadingState(true)
        fileNames.forEach((file) => {
            //Upload to S3 using AWS SDK

            try {
                const params = {
                    Bucket: process.env.REACT_APP_BUCKET_NAME,
                    Key: "archivos/pendientes/" + file,
                    Body: file,
                };
                s3Client.send(new PutObjectCommand(params), (err, uploaddata) => {
                    if (err) {
                        console.log("Error", err);
                        setErrorUploading(true)
                        setLoadingState(false)
                        setProgress(0)
                    }
                    if (uploaddata) {
                        cont = (cont + 100 / s3Counter)
                        setProgress(parseInt(cont))
                    }
                });
            } catch (err) {
                console.log("Error", err);
                setErrorUploading(true)
                setLoadingState(false)
                setProgress(0)
                cont = 0
            }
        })

    }

    useEffect(() => {
        if (progress > 97) {
            setLoadingState(false)
            setTimeout(() => {
                setcheckboxOptions([])
                setNcontrato('')
            }, 5000);
        }
    }, [progress])

    //useEffect print minDate and maxDate



    const fileTypeDataStatic = [
        { value: "54", label: "Anexos de traslado" },
        { value: "46", label: "Certificado de cumplimiento de obligaciones laborales (F30-1)" },
        { value: "41", label: "Dotación del periodo" },
        { value: "53", label: "Finiquitos sin ratificar" },
        { value: "48", label: "Formulario 21" },
        { value: "58", label: "Formulario F-3230" },
        { value: "43", label: "Libro de remuneraciones" },
        { value: "42", label: "Liquidaciones de sueldo" },
        { value: "52", label: "Comprobante de depósito" },
        { value: "50", label: "Comprobante Vacaciones" },
        { value: "51", label: "Comprobante de Permisos" },
        { value: "45", label: "Finiquitos o anexos de traslado según corresponda" },
        { value: "49", label: "Licencias medicas" },
        { value: "47", label: "Pago de IVA (F-29)" },
        { value: "44", label: "Planillas de cotizaciones previsionales (AFP. SALUD, MUTUAL, CCAF)" },
        { value: "40", label: "Reporte Relaciones Laborales " }
    ]


    //use Effect to update progress

    // useState waiting for ncontrato to change


    // useEffect if chekboxOptions change, clear fileNames
    useEffect(() => {
        setFileNames([])
        setFileTypes([])
        setFileCounter([])
        setGeneralFilesCounter(0)
        setGeneralFileType([])
        setProgress(0)
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
                        options={ncontratoOptions}
                    />
                    
                    {ncontrato ? (
                        
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
                            <DatePicker
                                views={['month', 'year',]}
                                label="Mes y año"
                                //minDate to be setted, dayjs
                                minDate={dayjs(minDate)}
                                maxDate={dayjs(maxDate)}
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
                                        //Disable after first selection
                                        isDisabled={item.filetype ? true : false}
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
                                                    let date = new Date(dateValue);
                                                    let month = date.getMonth() + 1;
                                                    let year = date.getFullYear();
                                                    let dateValueMMYYYY = month + "-" + year;
                                                    newFileNames.push(decodedValue.rut+"|"+dateValueMMYYYY+"|"+generalFileType[index].filetype.value + "|" + option.name + "|" + e.target.files[i].name)
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
                                                            //disable after value changes
                                                            isDisabled={tempTypes[i].filetype ? true : false}
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

                                                                //dateValue to MM-YYYY
                                                                let date = new Date(dateValue);
                                                                let month = date.getMonth() + 1;
                                                                let year = date.getFullYear();
                                                                let dateValueMMYYYY = month + "-" + year;
                                                                newFileNames.push(decodedValue.rut+"|"+dateValueMMYYYY+"|"+fileTypes[aux].filetype.value + "|" + option.name + "|" + e.target.files[k].name)
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
                    {/* if at least one fileTypes or generalfileTypes content is not ""  and fileNames  > 0 show button */}
                    {((fileTypes.filter(item => item.filetype !== "").length > 0 && fileNames.length > 0) || (generalFileType.filter(item => item.filetype !== "").length > 0 && fileNames.length > 0)) ? (

                        <Button variant="gradient" fullWidth onClick={sendfile}>
                            Enviar Formulario
                        </Button>
                    )
                        : <Button color="red" variant="gradient" disabled fullWidth onClick={sendfile}>
                            Pendiente por completar
                        </Button>}

                </CardFooter>
                <div className='p-2' >
                    {LoadingState ? <CircularProgress /> : null}
                    {!errorUploading && <Progress value={progress} label={" "} />}
                    {!errorUploading && progress > 0 && <Alert className='p-1' color="green">Al finalizar se limpiará el formulario luego de 5 segundos</Alert>}
                    {errorUploading && <Alert color="red">Error subiendo archivos!</Alert>}
                </div>

            </Card>
        </>
    )
}

export default FormFiles
