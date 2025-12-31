import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";

interface Attribute {
    name?: string;
    displayName?: string;
    defaultValue?: string;
    readOnly?: boolean;
    required?: boolean;
    type?: string;
    autoComplete?: string;
}

export function UserProfileFormFieldsCustom(props: UserProfileFormFieldsProps) {
    const { kcContext, i18n, onIsFormSubmittableValueChange } = props;

    const { messagesPerField, profile, formData } = kcContext;
    const { msg } = i18n;

    // Get attributes from profile
    const attributes = (
        profile?.attributesByName
            ? Object.entries(profile.attributesByName).map(([name, attr]) => ({
                  name,
                  displayName: (attr as Attribute).displayName,
                  defaultValue: (attr as Attribute).defaultValue,
                  readOnly: (attr as Attribute).readOnly,
                  required: (attr as Attribute).required,
                  type: (attr as Attribute).type,
                  autoComplete: (attr as Attribute).autoComplete
              }))
            : []
    ) as Attribute[];

    const handleFormChange = () => {
        const form = document.getElementById("kc-register-form") as HTMLFormElement;
        if (form) {
            const isValid = form.checkValidity();
            onIsFormSubmittableValueChange?.(isValid);
        }
    };

    // Helper function to resolve displayName from Keycloak template
    const resolveDisplayName = (displayName?: string) => {
        if (!displayName) return "";
        // Check if it's a Keycloak message template like ${username}
        const match = displayName.match(/^\$\{(\w+)\}$/);
        if (match) {
            return msg(match[1]);
        }
        return displayName;
    };

    return (
        <div className="space-y-5">
            {attributes.map((attribute: Attribute) => {
                const fieldName = attribute.name ?? "";
                const fieldValue = (formData as Record<string, unknown>)?.[fieldName] ?? attribute.defaultValue ?? "";

                if (attribute.readOnly) {
                    return (
                        <div key={fieldName} className="space-y-2">
                            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-900">
                                {resolveDisplayName(attribute.displayName)}
                                {attribute.required && <span className="text-red-600 ml-1">*</span>}
                            </label>
                            <input
                                type={attribute.type ?? "text"}
                                id={fieldName}
                                value={fieldValue as string}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                    );
                }

                const hasError = messagesPerField.existsError(fieldName);
                const errorMessage = messagesPerField.get(fieldName);

                return (
                    <div key={fieldName} className="space-y-2">
                        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-900">
                            {resolveDisplayName(attribute.displayName)}
                            {attribute.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                        <input
                            type={attribute.type ?? "text"}
                            id={fieldName}
                            name={fieldName}
                            defaultValue={fieldValue as string}
                            autoComplete={attribute.autoComplete}
                            required={attribute.required}
                            onChange={handleFormChange}
                            onBlur={handleFormChange}
                            aria-invalid={hasError}
                            aria-describedby={hasError ? `input-error-${fieldName}` : undefined}
                            className={clsx(
                                "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                hasError ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                            )}
                        />
                        {hasError && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span
                                    id={`input-error-${fieldName}`}
                                    className="text-sm text-red-600"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{ __html: kcSanitize(errorMessage) }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
