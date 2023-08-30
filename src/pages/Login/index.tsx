import { useState } from "react";
import { Button, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputRightElement, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HrDivider } from "../../components/Layout/Auth/HrDivider";
import { useFormik } from "formik";
import { loginInitialValues, loginValidationSchema } from "../../utils/forms/login";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { onLogin } = useAuth();

    const formik = useFormik({
        initialValues: loginInitialValues,
        validationSchema: loginValidationSchema,
        onSubmit: async values => {
            await onLogin(values.email, values.password);
        }
    });

    function handleShowPassword() {
        setShowPassword(!showPassword);
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <VStack
                gap={4}
            >
                <FormControl
                    isInvalid={!!formik.errors.email && formik.touched.email}
                >
                    <FormLabel>Email</FormLabel>
                    <Input
                        type='email'
                        placeholder="Insira seu email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        autoComplete="email"
                    />
                    <FormErrorMessage>{formik.errors?.email}</FormErrorMessage>
                </FormControl>
                <FormControl
                    isInvalid={!!formik.errors.password && formik.touched.password}
                >
                    <FormLabel
                        display='flex'
                        justifyContent='space-between'
                        alignContent='center'
                        me={0}
                    >
                        Senha
                        <Link to='/auth/forgot-password'>
                            <Text
                                fontSize={'sm'}
                                color={'blue.400'}
                            >
                                Esqueceu sua senha?
                            </Text>
                        </Link>
                    </FormLabel>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Insira sua senha'
                            id='password'
                            name='password'
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            autoComplete="current-password"
                        />
                        <InputRightElement>
                            <IconButton
                                size='sm'
                                variant={'ghost'}
                                onClick={handleShowPassword}
                                aria-label="Mostre a senha"
                                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{formik.errors?.password}</FormErrorMessage>
                </FormControl>
                <Button
                    colorScheme='blue'
                    w={'100%'}
                    type="submit"
                    isLoading={formik.isSubmitting}
                    loadingText="Entrando"
                    spinnerPlacement='end'
                >
                    Entrar
                </Button>
                <Text
                    fontSize={'sm'}
                >
                    Não tem uma conta?
                    <Link to='/auth/register'>
                        <Text
                            color={'blue.400'}
                            display={'inline'}
                            ps={1}
                            as={'span'}
                        >
                            Crie uma
                        </Text>
                    </Link>
                </Text>
                <HrDivider />
                <Button>
                    Entrar com o google
                </Button>
            </VStack>
        </form>

    )
}