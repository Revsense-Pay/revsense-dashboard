'use client';

import DarkLogo from '@/assets/images/logo-dark.png';
import LightLogo from '@/assets/images/logo-light.png';
import TextFormInput from '@/components/from/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const SignIn = () => {
  const router = useRouter();

  const schema = yup.object({
    email: yup.string().email().required('Please enter Email'),
    password: yup.string().required('Please enter password'),
  });

  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: 'demo@gmail.com',
      password: '123456',
    },
    resolver: yupResolver(schema),
  });

  const handleLogin = () => {
    router.push('/dashboards');
  };

  return (
    <div className="account-pages py-5">
      <div className="container">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-lg">
              <CardBody className="p-5">
                <div className="text-center mb-4 auth-logo">
                  <Link href="/" className="logo-dark d-inline-block">
                    <Image src={DarkLogo} height={32} alt="logo dark" />
                  </Link>

                  <Link href="/" className="logo-light d-inline-block">
                    <Image src={LightLogo} height={28} alt="logo light" />
                  </Link>
                </div>

                <h4 className="fw-bold text-dark mb-2 text-center">
                  Welcome Back!
                </h4>
                <p className="text-muted text-center">
                  Sign in to your account to continue
                </p>

                <form onSubmit={handleSubmit(handleLogin)} className="mt-4">
                  <div className="mb-3">
                    <TextFormInput
                      control={control}
                      name="email"
                      placeholder="Enter your email"
                      label="Email Address"
                    />
                  </div>

                  <div className="mb-3">
                    <Link
                      href="/auth/reset-password"
                      className="float-end text-muted ms-1"
                    >
                      Forgot password?
                    </Link>

                    <TextFormInput
                      control={control}
                      name="password"
                      placeholder="Enter your password"
                      label="Password"
                      type="password"
                    />
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember-me"
                    />
                    <label className="form-check-label" htmlFor="remember-me">
                      Remember me
                    </label>
                  </div>

                  <div className="d-grid">
                    <button
                      className="btn btn-dark btn-lg fw-medium"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </CardBody>
            </Card>

            <p className="text-center mt-4 text-white text-opacity-50">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="text-decoration-none text-white fw-bold"
              >
                Sign Up
              </Link>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SignIn;