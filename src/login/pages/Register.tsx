import type { JSX } from "react";
import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { UserProfileFormFieldsCustom } from "../UserProfileFormFieldsCustom";
import logo from "../assets/img/log.avif";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        const win = window as Window & { onSubmitRecaptcha?: () => void };
        win.onSubmitRecaptcha = () => {
            const form = document.getElementById("kc-register-form") as HTMLFormElement;
            if (form) {
                form.requestSubmit();
            }
        };

        return () => {
            delete win.onSubmitRecaptcha;
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={
                <div className="flex flex-col items-center space-y-4">
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="h-8 w-auto mb-4" />
                    <div className="space-y-2 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                            {messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
                        </h1>
                    </div>
                </div>
            }
            displayMessage={true}
            displayInfo={true}
            infoNode={
                <div className="mt-8 text-center">
                    <span className="text-gray-600">
                        {msg("backToLogin")}{" "}
                        <a href={url.loginUrl} className="font-semibold text-orange-600 hover:text-orange-700">
                            {msg("doLogIn")}
                        </a>
                    </span>
                </div>
            }
        >
            <form id="kc-register-form" className="space-y-6" action={url.registrationAction} method="post">
                {/* User Profile Form Fields */}
                <UserProfileFormFieldsCustom
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />

                {/* Terms Acceptance */}
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}

                {/* reCAPTCHA */}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="flex justify-center">
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction} />
                    </div>
                )}

                {/* Form Options */}
                <div className="space-y-4 pt-4">
                    {/* Submit Button */}
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <button
                            className={`
                                w-full py-3 px-4 
                                bg-orange-600 text-white font-medium rounded-lg
                                hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                                g-recaptcha
                            `}
                            data-sitekey={recaptchaSiteKey}
                            data-callback="onSubmitRecaptcha"
                            data-action={recaptchaAction}
                            type="submit"
                        >
                            {msg("doRegister")}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                            className={`
                                w-full py-3 px-4 
                                bg-orange-600 text-white font-medium rounded-lg
                                hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {msgStr("doRegister")}
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Terms Title */}
            <div className="text-sm font-medium text-gray-700">{msg("termsTitle")}</div>

            {/* Terms Text */}
            <div
                id="kc-registration-terms-text"
                className="text-sm text-gray-600 max-h-40 overflow-y-auto p-3 bg-white rounded border border-gray-200"
            >
                {msg("termsText")}
            </div>

            {/* Accept Checkbox */}
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    className={`
                        mt-1 h-4 w-4 rounded border-gray-300 
                        text-blue-600 focus:ring-blue-500
                        ${messagesPerField.existsError("termsAccepted") ? "border-red-500" : ""}
                    `}
                    checked={areTermsAccepted}
                    onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                    aria-invalid={messagesPerField.existsError("termsAccepted")}
                />
                <label htmlFor="termsAccepted" className="text-sm text-gray-700 cursor-pointer">
                    {msg("acceptTerms")}
                    <span className="text-red-500 ml-1">*</span>
                </label>
            </div>

            {/* Error Message */}
            {messagesPerField.existsError("termsAccepted") && (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span
                        id="input-error-terms-accepted"
                        className="text-sm text-red-600"
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                        }}
                    />
                </div>
            )}
        </div>
    );
}
