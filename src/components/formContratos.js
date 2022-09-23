import React from 'react'
import { Card, CardHeader, CardBody, Typography, Input, Button, Progress, Alert } from "@material-tailwind/react";
import { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material';
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

export const FormContratos = () => {
    const [fileName, setFileName] = useState([])
    const [errorUploading, setErrorUploading] = useState(false)
    const [LoadingState, setLoadingState] = useState(false);
    const [progress, setProgress] = useState(0)

    var cont = 0
    const s3Client = new S3Client({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET,
        },
    });
    const sendfile = () => {
        setLoadingState(true);
        setProgress(0)
        setLoadingState(true)
        //Upload to S3 using AWS SDK
        try {
            const params = {
                Bucket: process.env.REACT_APP_BUCKET_NAME,
                Key: "contratos/pendientes/" + fileName.name,
                Body: fileName.name,
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
                    cont = 100
                    setProgress(parseInt(cont))
                    console.log("Upload Success", uploaddata);
                }
            });

        } catch (err) {
            console.log("Error", err);
            setErrorUploading(true)
            setLoadingState(false)
            setProgress(0)
            cont = 0
        }

    }

    useEffect(() => {
        if (progress > 97) {
            setLoadingState(false)
            setTimeout(() => {
                setProgress(0)
                setFileName([])
                setErrorUploading(false)
                setLoadingState(false)
            }, 5000);
        }
    }, [progress])
    return (
        <Card className="w-96 bg-gray-200" >
            <CardHeader
                variant="gradient"
                color='blue'
                className="mb-4 grid h-28 place-items-center p-2"
            >
                <Typography variant="h3" color="white">
                    Formulario para actualizar contratos
                </Typography>
                <Typography variant="h5" color="white">
                    Se debe subir un archivo .xlsx
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
                <Input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {
                        setFileName(e.target.files[0]);
                    }}
                />
                <Button variant="gradient" fullWidth onClick={sendfile}>
                    Enviar Formulario
                </Button>

            </CardBody>
            <div className='p-2' >
                {LoadingState ? <CircularProgress /> : null}
                {!errorUploading && <Progress value={progress} label={" "} />}
                {!errorUploading && progress > 0 && <Alert className='p-1' color="green">Al finalizar se limpiará el formulario luego de 5 segundos</Alert>}
                {errorUploading && <Alert color="red">Error subiendo archivos!</Alert>}
            </div>
        </Card>
    )
}

export default FormContratos