import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import logo from "../assets/img/log.avif";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, messagesPerField, stateChecker, account } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img src={logo} alt="Logo" className="h-8 w-auto" />
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        {/* Header */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{msg("editAccountHtmlTitle")}</h2>

                        {/* Success/Error Message */}
                        {kcContext.message && kcContext.message.type === "success" && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-green-800" dangerouslySetInnerHTML={{ __html: kcSanitize(kcContext.message.summary) }} />
                            </div>
                        )}

                        {kcContext.message && kcContext.message.type === "error" && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-red-800" dangerouslySetInnerHTML={{ __html: kcSanitize(kcContext.message.summary) }} />
                            </div>
                        )}

                        <form action={url.accountUrl} className="space-y-5" method="post">
                            <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                            {/* Username Field - Only show if not using email as username */}
                            {!realm.registrationEmailAsUsername && (
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                                        {msg("username")}
                                        {realm.editUsernameAllowed && <span className="text-red-600 ml-1">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        disabled={!realm.editUsernameAllowed}
                                        defaultValue={account.username ?? ""}
                                        className={clsx(
                                            "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                            !realm.editUsernameAllowed
                                                ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                                                : "border-gray-300 hover:border-gray-400",
                                            messagesPerField.printIfExists("username", "border-red-600 bg-red-50")
                                        )}
                                    />
                                    {messagesPerField.existsError("username") && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span
                                                className="text-sm text-red-600"
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("username")) }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    {msg("email")}
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    defaultValue={account.email ?? ""}
                                    autoComplete="email"
                                    className={clsx(
                                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                        "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                        "border-gray-300 hover:border-gray-400",
                                        messagesPerField.printIfExists("email", "border-red-600 bg-red-50")
                                    )}
                                />
                                {messagesPerField.existsError("email") && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            className="text-sm text-red-600"
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("email")) }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* First Name Field */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                                    {msg("firstName")}
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    defaultValue={account.firstName ?? ""}
                                    autoComplete="given-name"
                                    className={clsx(
                                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                        "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                        "border-gray-300 hover:border-gray-400",
                                        messagesPerField.printIfExists("firstName", "border-red-600 bg-red-50")
                                    )}
                                />
                                {messagesPerField.existsError("firstName") && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            className="text-sm text-red-600"
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("firstName")) }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Last Name Field */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                                    {msg("lastName")}
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    defaultValue={account.lastName ?? ""}
                                    autoComplete="family-name"
                                    className={clsx(
                                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                        "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                        "border-gray-300 hover:border-gray-400",
                                        messagesPerField.printIfExists("lastName", "border-red-600 bg-red-50")
                                    )}
                                />
                                {messagesPerField.existsError("lastName") && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            className="text-sm text-red-600"
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("lastName")) }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Form Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                                >
                                    {msgStr("doSave")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Template>
    );
}
