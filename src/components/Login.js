import React from 'react';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';


const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input : AutenticarInput) {
        autenticarUsuario(input : $input) {
            token
        }
    }
`;

const Login = () => {
    const navigate = useNavigate();
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const [showSuccess, setshowSuccess] = React.useState(false);
    const [showError, setshowError] = React.useState(false);
    const [errorMessage, seterrorMessage] = React.useState(false);
    const [LoadingState, setLoadingState] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            rut: '',
            password: ''
        },
        validationSchema: Yup.object({
            rut: Yup.string()
                .required('El rut no puede ir vacio'),
            password: Yup.string()
                .required('La contraseña  no puede ir vacia')
        }),
        onSubmit: async valores => {
            const { rut, password } = valores;
            setLoadingState(true);
            setshowError(false);
            try {
                
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            rut,
                            password
                        }
                    }
                });

                //console.log(data);
                // Guardar el token en localstorage
                setTimeout(() => {
                    setLoadingState(false);
                    //console.log('Guardando token');
                    setshowSuccess(true);
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                    //console.log(localStorage.getItem('token'));
                }, 500);

                
                //Redireccionar hacia clientes
                setTimeout(() => {
                    setLoadingState(false);
                    //console.log('Redireccionando');
                    setshowSuccess(true);
                    navigate('/forms');
                }, 2000);

            } catch (error) {
                setLoadingState(false);
                seterrorMessage(error)
                setshowError(true);
            }
        }
    })

    return (
        <div className='bg-gray-800 min-h-screen flex flex-col justify-center text-center text-2xl text-white font-light' style= {{backgroundImage: "url(http://s7d2.scene7.com/is/image/Caterpillar/CM20170215-04840-51926?$highres$)",height:"100%",width:"100%",backgroundSize:"cover"}}>

            <div className="flex justify-center mt-5 ">

                <div className="w-full max-w-sm ">
                {LoadingState ? <CircularProgress /> : null}
                {showError ? (<><div id="alert-border-2" className="flex p-4 mb-4 bg-red-100 border-t-4 border-red-500 dark:bg-red-200" role="alert">
                    <svg className="flex-shrink-0 w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    <div className="ml-3 text-sm font-medium text-red-700">
                    {String(errorMessage)}
                    </div>
                    </div></>)
                :null}
                {showSuccess ? (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                    <span className="font-medium">Inicio de sesion correcto!</span> Redireccionando...
                  </div>
                ) : null}
                    <form
                        className="bg-white rounded drop-shadow-2xl shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        
                        <div className="mb-4">
                            
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
                                Rut
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="rut"
                                type="text"
                                placeholder="12345678-9"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rut}
                            />
                        </div>

                        {formik.touched.rut && formik.errors.rut ? (
                            <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-1" >
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.rut}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Contraseña
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="***********"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                        </div>

                        {formik.touched.password && formik.errors.password ? (
                            <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-1" >
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.password}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:cursor-pointer hover:bg-gray-900"
                            value="Iniciar Sesión"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login