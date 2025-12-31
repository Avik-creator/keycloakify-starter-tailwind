import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            displayMessage={true}
            infoNode={<p className="text-gray-600">{realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}</p>}
            headerNode={
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">{msg("emailForgotTitle")}</h1>
                </div>
            }
        >
            <form id="kc-reset-password-form" className="space-y-6" action={url.loginAction} method="post">
                {/* Username/Email Field */}
                <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                        {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                        <span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className={`
                            w-full px-4 py-3 border rounded-lg 
                            transition-all duration-200
                            focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none
                            ${
                                messagesPerField.existsError("username")
                                    ? "border-red-600 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 hover:border-gray-400"
                            }
                        `}
                        autoFocus
                        defaultValue={auth.attemptedUsername ?? ""}
                        autoComplete="username"
                        aria-invalid={messagesPerField.existsError("username")}
                        aria-describedby={messagesPerField.existsError("username") ? "input-error-username" : undefined}
                    />

                    {/* Error Message for Username */}
                    {messagesPerField.existsError("username") && (
                        <div className="flex items-center gap-2 mt-2">
                            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span
                                id="input-error-username"
                                className="text-sm text-red-600"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("username"))
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Form Options and Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    {/* Back to Login Link */}
                    <div>
                        <a
                            href={url.loginUrl}
                            className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors font-medium"
                        >
                            &laquo; {msg("backToLogin")}
                        </a>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full">
                        <button
                            type="submit"
                            className={`
                                w-full px-6 py-3 
                                bg-orange-600 text-white font-medium rounded-lg
                                hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {msgStr("doSubmit")}
                        </button>
                    </div>
                </div>
            </form>
        </Template>
    );
}
