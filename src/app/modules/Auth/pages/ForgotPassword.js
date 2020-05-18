import React, {Component} from "react";
import {Formik, Field} from "formik";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {Input} from "../../../../_metronic/_partials/controls";
import {injectIntl} from "react-intl";
import * as auth from "../_redux/authRedux";
import {requestPassword} from "../_redux/authCrud";

// TODO: Rewrite to pure function
class ForgotPassword extends Component {
    state = {isRequested: false};

    render() {
        const {intl} = this.props;
        const {isRequested} = this.state;

        if (isRequested) {
            return <Redirect to="/auth"/>;
        }

        const getInputClasses = (meta, fieldname) => {
            let result = "form-control form-control-solid h-auto py-5 px-6 ";
            if (meta.touched && meta.error) {
                result += " is-invalid"
            }

            if (meta.touched && !meta.error) {
                result += " is-valid"
            }

            return result;
        }

        return (
            <div className="login-form">
                <div className="text-center mb-10 mb-lg-20">
                    <h3 className="font-size-h1">Forgotten Password ?</h3>
                </div>

                <Formik
                    initialValues={{email: ""}}
                    validate={values => {
                        const errors = {};

                        if (!values.email) {
                            errors.email = intl.formatMessage({
                                id: "AUTH.VALIDATION.REQUIRED_FIELD"
                            });
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = intl.formatMessage({
                                id: "AUTH.VALIDATION.INVALID_FIELD"
                            });
                        }

                        return errors;
                    }}
                    onSubmit={(values, {setStatus, setSubmitting}) => {
                        requestPassword(values.email)
                            .then(() => {
                                this.setState({isRequested: true});
                            })
                            .catch(() => {
                                setSubmitting(false);
                                setStatus(
                                    intl.formatMessage(
                                        {id: "AUTH.VALIDATION.NOT_FOUND"},
                                        {name: values.email}
                                    )
                                );
                            });
                    }}
                >
                    {({
                          values,
                          status,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting
                      }) => (
                        <form onSubmit={handleSubmit} className="form">
                            {status && (
                                <div role="alert" className="alert alert-danger">
                                    <div className="alert-text">{status}</div>
                                </div>
                            )}

                            <div className="form-group">
                                <Field
                                    type="email"
                                    name="email"
                                    component={Input}
                                    placeholder="Email"
                                    label="Email"
                                >

                                    {({field, form, meta}) => (
                                        <div>
                                            <input
                                                type="email" {...field}
                                                className={`${getInputClasses(meta)}`}
                                                placeholder="Enter Email"/>
                                            {meta.touched &&
                                            meta.error && <div className="error invalid-feedback">{meta.error}</div>}
                                        </div>
                                    )}
                                </Field>
                            </div>

                            <div className="form-group d-flex flex-wrap flex-center">
                                <button
                                    id="kt_login_forgot_submit"
                                    type="submit"
                                    className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </button>
                                <Link to="/auth">
                                    <button
                                        type="button"
                                        id="kt_login_forgot_cancel"
                                        className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                    >
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
