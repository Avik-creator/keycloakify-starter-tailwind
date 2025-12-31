import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return (
                            fieldNames.includes("username") ||
                            fieldNames.includes("email") ||
                            fieldNames.includes("password") ||
                            fieldNames.includes("password-confirm")
                        );
                    },
                    get: (fieldName: string) => {
                        const errors: Record<string, string> = {
                            username: "Username already in use",
                            email: "Invalid email address",
                            password: "Password must be at least 8 characters",
                            "password-confirm": "Passwords do not match"
                        };
                        return errors[fieldName] || "";
                    }
                }
            }}
        />
    )
};

export const WithPrefilledData: Story = {
    render: () => <KcPageStory />
};

export const WithTermsRequired: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                termsAcceptanceRequired: true
            }}
        />
    )
};

export const WithRecaptcha: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                recaptchaRequired: true,
                recaptchaVisible: true,
                recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            }}
        />
    )
};

export const WithTermsAndRecaptcha: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                termsAcceptanceRequired: true,
                recaptchaRequired: true,
                recaptchaVisible: true,
                recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            }}
        />
    )
};

export const WithValidationError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return fieldNames.includes("global");
                    },
                    get: (fieldName: string) => {
                        if (fieldName === "global") {
                            return "Registration is currently disabled";
                        }
                        return "";
                    }
                }
            }}
        />
    )
};

export const WithEmailAsUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: { registrationEmailAsUsername: true }
            }}
        />
    )
};

export const WithPasswordReset: Story = {
    render: () => <KcPageStory />
};

export const WithoutPasswordField: Story = {
    render: () => <KcPageStory />
};
