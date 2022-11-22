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
import { Checkbox, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Select from 'react-select';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CircularProgress } from '@mui/material';
import { useQuery, gql } from '@apollo/client';

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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

const FormPeriodo = () => {
  const [ncontrato, setNcontrato] = useState("")
  const [fileName, setFileName] = useState([])
  const [progress, setProgress] = useState(0)
  const [errorUploading, setErrorUploading] = useState(false)
  const [LoadingState, setLoadingState] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [dateRemuneraciones, setDateRemuneraciones] = useState(dayjs(new Date()).endOf('month').format('YYYY-MM-DD'));
  const [dateHorasExtras, setDateHorasExtras] = useState(dayjs(new Date()).endOf('month').format('YYYY-MM-DD'));
  const [subContrato, setSubContrato] = useState(false)
  const [validForm, setValidForm] = useState(false)

  //useState for RUT_OPC_CAP,OCP_CAP,ADC_EMPRESA,ENCARGADO_RRHH,MAIL_OPC_CAP_1,MAIL_OCP_CAP_2
  const [rutOpcCap, setRutOpcCap] = useState("")
  const [opcCap, setOpcCap] = useState("")
  const [adcEmpresa, setAdcEmpresa] = useState("")
  const [encargadoRrhh, setEncargadoRrhh] = useState("")
  const [mailOpcCap1, setMailOpcCap1] = useState("")
  const [mailOpcCap2, setMailOpcCap2] = useState("")
  const [ncontratoOptions, setNcontratoOptions] = useState([{ value: "000000", label: "Sin contratos" }])
  const [checkboxOptions, setcheckboxOptions] = useState([{ name: "Numero de contrato sin faenas", value: false }])
  const rut = localStorage.getItem('token').split('.')[1]
  const rutDecoded = JSON.parse(atob(rut))
  const rutUser = rutDecoded.rut
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  var cont = 0

  const { data } = useQuery(obtenerContratosRut, {
    variables: {
      rut: rutUser
    }
  });

  useEffect(() => {
    if (data) {
      if(data.obtenerContratosRut != null){
        let ncontratoOptionsAux = []
        data.obtenerContratosRut.contratos.forEach((contrato) => {
          ncontratoOptionsAux.push({ value: contrato.name, label: contrato.name })
        })
        setNcontratoOptions(ncontratoOptionsAux)
      }
    }
  }, [data])


  useEffect(() => {
    if (data) {
      if (data.obtenerContratosRut != null) {
        let checkboxOptionsAux = []
        //filter in data to get the selected ncontrato and assign it to checkboxOptions
        data.obtenerContratosRut.contratos.forEach((contrato) => {
          if (contrato.name === ncontrato.value) {
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
  }, [ncontrato,data])

  const token = localStorage.getItem('token')
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedValue = JSON.parse(window.atob(base64));
  const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET,
    },
  });

  const sendfile = () => {
    setLoadingState(true);
    let s3Counter = fileName.length
    setProgress(0)
    setLoadingState(true)
    fileName.forEach((file, index) => {
      //Upload to S3 using AWS SDK

      try {

        const params = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          Key: "periodo/pendientes/" + file.name,
          Body: file.file,
        };
        //wait 1 second before upload file
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

    //Timeout of 5 seconds to wait for the upload to finish

  }

  useEffect(() => {
    if (progress > 97) {
      setLoadingState(false)
      setTimeout(() => {
        setcheckboxOptions([])
        setProgress(0)
        setNcontrato("")
        setFileName([])
        setValidForm(false)
      }, 5000);
    }
  }, [progress])

  //useEffect If all useState are not empty, then enable button
  useEffect(() => {
    if (subContrato !== "" && ncontrato !== "" && dateValue !== "" && dateRemuneraciones !== "" && dateHorasExtras !== "" && rutOpcCap !== "" && opcCap !== "" && adcEmpresa !== "" && encargadoRrhh !== "" && mailOpcCap1 !== "" && mailOpcCap2 !== "" && fileName.length > 0) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [ncontrato, fileName,dateValue, dateRemuneraciones, dateHorasExtras, rutOpcCap, opcCap, adcEmpresa, encargadoRrhh, mailOpcCap1, mailOpcCap2, subContrato])



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

  useEffect(() => {
    //reset all values
    setRutOpcCap("")
    setOpcCap("")
    setAdcEmpresa("")
    setEncargadoRrhh("")
    setMailOpcCap1("")
    setMailOpcCap2("")
    setSubContrato(false)
    setFileName([])
    setProgress(0)
    setLoadingState(false)
    setValidForm(false)
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
            options={ncontratoOptions}
          />

          {ncontrato ? (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
              <DatePicker
                views={['month', 'year',]}
                label="Mes y año"
                minDate={dayjs(minDate)}
                maxDate={dayjs(maxDate)}
                value={dateValue}
                onChange={(newValue) => {
                  setDateValue(newValue);
                  const lastDay = dayjs(newValue).endOf('month').format('YYYY-MM-DD')
                  setDateRemuneraciones(lastDay)
                  setDateHorasExtras(lastDay)
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

          {/* Form with 6 input texts and 2 input date */}
          {ncontrato && checkboxOptions.some((option) => option.value === true) ? <div className='p-3'>
            {/* radio button with two options for subContrato*/}
            Indique si es un Subcontrato
            <RadioGroup
              className='p-3'
              row
              aria-label="subContrato"
              name="subContrato"
              value={subContrato}
              onChange={(e) => setSubContrato(e.target.value)}
              required
            >
              <FormControlLabel value="SI" control={<Radio />} label="Si" />
              <FormControlLabel value="NO" control={<Radio />} label="No" />
            </RadioGroup>
            {/* input text for rutOpcCap */}
            <div className='p-2'>
              <TextField
                className='p-3'
                label="RUT OPC CAP"
                variant="outlined"
                value={rutOpcCap}
                onChange={(e) => setRutOpcCap(e.target.value)}
                required
              />
            </div>
            {/* input text for opccap */}
            <div className='p-2'>
              <TextField
                className='p-2'
                label="OPC CAP"
                variant="outlined"
                value={opcCap}
                onChange={(e) => setOpcCap(e.target.value)}
                required
              />
            </div>

            {/* input text for adcEmpresa */}
            <div className='p-2'>
              <TextField
                className='p-2'
                label="ADC Empresa"
                variant="outlined"
                value={adcEmpresa}
                onChange={(e) => setAdcEmpresa(e.target.value)}
                required
              />
            </div>
            {/* input text for encargadoRRHH */}
            <div className='p-2'>
              <TextField
                className='p-2'
                label="Encargado RRHH"
                variant="outlined"
                value={encargadoRrhh}
                onChange={(e) => setEncargadoRrhh(e.target.value)}
                required
              />
            </div>
            {/* input text for mailOpcCap1 */}
            <div className='p-2'>
              <TextField
                className='p-2'
                label="Mail OPC CAP 1"
                variant="outlined"
                value={mailOpcCap1}
                onChange={(e) => setMailOpcCap1(e.target.value)}
                required
              />
            </div>
            {/* input text for mailOpcCap2 */}
            <div className='p-2'>
              <TextField
                className='p-2'
                label="Mail OPC CAP 2"
                variant="outlined"
                value={mailOpcCap2}
                onChange={(e) => setMailOpcCap2(e.target.value)}
                required
              />
            </div>

            <div className='p-2'>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
                <DatePicker
                  adapterLocale={es}
                  label="Fecha corte de remuneración"
                  value={dateRemuneraciones}
                  views={['day']}
                  minDate={dayjs('2022-' + parseInt(dayjs(dateRemuneraciones).format('MM')) + '-01')}
                  maxDate={dayjs('2022-' + parseInt(dayjs(dateRemuneraciones).format('MM')) + '-' + parseInt(dayjs(dateRemuneraciones).endOf('month').format('DD')))}
                  onChange={(newValue) => {
                    setDateRemuneraciones(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className='p-1'>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
                <DatePicker
                  adapterLocale={es}
                  label="Fecha corte Horas extras"
                  value={dateHorasExtras}
                  views={['day']}
                  minDate={dayjs('2022-' + parseInt(dayjs(dateRemuneraciones).format('MM')) + '-01')}
                  maxDate={dayjs('2022-' + parseInt(dayjs(dateRemuneraciones).format('MM')) + '-' + parseInt(dayjs(dateRemuneraciones).endOf('month').format('DD')))}
                  onChange={(newValue) => {
                    setDateHorasExtras(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <Input
              type="file"
              accept=".xls"
              onChange={(e) => {
                //if e.target.files is not empty
                if (e.target.files.length > 0) {
                  //append chechboxOptions value if is true
                  let newCheckboxOptions = [...checkboxOptions];
                  let newFileName = ""
                  let tempValue = [];
                  //for each true checkeboxOptions add to setfileName
                  newCheckboxOptions.forEach((option, index) => {
                    if (option.value) {
                      let date = new Date(dateValue);
                      let month = date.getMonth() + 1;
                      let year = date.getFullYear();
                      let dateValueMMYYYY = month + "-" + year;
                      newFileName = decodedValue.rut + "|" + ncontrato.value + "|" + dateValueMMYYYY + "|" + option.name + "|" + subContrato + "|" + rutOpcCap + "|" + opcCap + "|" + adcEmpresa + "|" + encargadoRrhh + "|" + mailOpcCap1 + "|" + mailOpcCap2 + "|" + dayjs(dateRemuneraciones).format('DD-MM-YYYY') + "|" + dayjs(dateHorasExtras).format('DD-MM-YYYY') + "|" + e.target.files[0].name;
                      tempValue.push({"file":e.target.files[0] ,"name":newFileName})
                    }
                  })
                  setFileName(tempValue)
                }
              }}
            />
          </div>
            : null}

        </CardBody>
        <CardFooter className="pt-0">
          {/*  if validForm, show button blue else show button red*/}
          {validForm ? (

            <Button variant="gradient" fullWidth onClick={sendfile}>
              Enviar Formulario
            </Button>
          ) : (
            <Button color="red" variant="gradient" fullWidth disabled onClick={sendfile}>
              Pendiente por completar
            </Button>
          )}


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

export default FormPeriodo
