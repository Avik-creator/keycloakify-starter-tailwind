import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import logo from "../assets/img/log.avif";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const socialProviders = social?.providers ?? [];
    const doShowSocialProviders = (social?.displayInfo ?? true) && socialProviders.length > 0;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={true}
            headerNode={
                <div className="flex flex-col items-center space-y-4">
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="h-8 w-auto mb-4" />
                    <div className="space-y-2 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">{msg("loginAccountTitle")}</h1>
                        <p className="text-lg text-gray-500">{msg("loginTotpStep2")}</p>
                    </div>
                </div>
            }
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div className="mt-8 text-center">
                    <span className="text-gray-600">
                        {msg("noAccount")}{" "}
                        <a tabIndex={8} href={url.registrationUrl} className="font-semibold text-orange-600 hover:text-orange-700">
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
        >
            <div id="kc-form" className="space-y-6">
                {realm.password && (
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                        className="space-y-5"
                    >
                        {!usernameHidden && (
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                                    {!realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : !realm.registrationEmailAsUsername
                                          ? msg("usernameOrEmail")
                                          : msg("email")}
                                </label>
                                <input
                                    tabIndex={2}
                                    id="username"
                                    className={clsx(
                                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                        "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                        messagesPerField.existsError("username", "password")
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    )}
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    type="text"
                                    autoFocus
                                    autoComplete="username"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                                {messagesPerField.existsError("username", "password") && (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            id="input-error"
                                            className="text-sm text-red-600"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                {msg("password")}
                            </label>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                <input
                                    tabIndex={3}
                                    id="password"
                                    className={clsx(
                                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                        "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                        messagesPerField.existsError("username", "password")
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    )}
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                            </PasswordWrapper>
                            {usernameHidden && messagesPerField.existsError("username", "password") && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span
                                        id="input-error"
                                        className="text-sm text-red-600"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            {realm.rememberMe && !usernameHidden && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        tabIndex={5}
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        defaultChecked={!!login.rememberMe}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{msg("rememberMe")}</span>
                                </label>
                            )}
                            {realm.resetPasswordAllowed && (
                                <a
                                    tabIndex={6}
                                    href={url.loginResetCredentialsUrl}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    {msg("doForgotPassword")}
                                </a>
                            )}
                        </div>

                        <div id="kc-form-buttons">
                            <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                            <button
                                tabIndex={7}
                                disabled={isLoginButtonDisabled}
                                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                name="login"
                                id="kc-login"
                                type="submit"
                            >
                                {msgStr("doLogIn")}
                            </button>
                        </div>
                    </form>
                )}

                {doShowSocialProviders && (
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-sm text-gray-500">{msg("identity-provider-login-label")}</span>
                            </div>
                        </div>

                        <div className={clsx("grid gap-3", socialProviders.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                            {socialProviders.map(provider => (
                                <a
                                    key={provider.providerId ?? provider.alias}
                                    href={provider.loginUrl}
                                    className={clsx(
                                        "flex items-center justify-center gap-3 rounded-lg border border-gray-300",
                                        "px-4 py-3 text-sm font-medium text-gray-900",
                                        "hover:border-gray-400 hover:bg-gray-50 transition-colors",
                                        socialProviders.length === 1 ? "col-span-1" : "col-span-1"
                                    )}
                                >
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                                        {(provider.displayName ?? "").slice(0, 1).toUpperCase()}
                                    </span>
                                    <span className="truncate">{provider.displayName}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className="relative">
            {children}
            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}
