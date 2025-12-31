import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "password.ftl" });

const meta = {
    title: "account/password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithPasswordSet: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                }
            }}
        />
    )
};

export const WithoutPasswordSet: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: false
                }
            }}
        />
    )
};

export const WithSuccessMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                message: {
                    type: "success",
                    summary: "Your password has been changed successfully."
                }
            }}
        />
    )
};

export const WithErrorMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                message: {
                    type: "error",
                    summary: "Current password is incorrect."
                }
            }}
        />
    )
};

export const WithIncorrectCurrentPassword: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "password",
                    get: (fieldName: string) => {
                        if (fieldName === "password") {
                            return "Current password is incorrect";
                        }
                        return "";
                    }
                }
            }}
        />
    )
};

export const WithPasswordMismatch: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "password-confirm",
                    get: (fieldName: string) => {
                        if (fieldName === "password-confirm") {
                            return "Passwords do not match";
                        }
                        return "";
                    }
                }
            }}
        />
    )
};

export const WithWeakPassword: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "password-new",
                    get: (fieldName: string) => {
                        if (fieldName === "password-new") {
                            return "Password must be at least 8 characters long and contain uppercase, lowercase, numbers and special characters";
                        }
                        return "";
                    }
                }
            }}
        />
    )
};

export const WithUserData: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe"
                },
                password: {
                    passwordSet: true
                }
            }}
        />
    )
};

export const InitialPasswordSet: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "newuser"
                },
                password: {
                    passwordSet: false
                },
                message: {
                    type: "info",
                    summary: "Please set your initial password."
                }
            }}
        />
    )
};

export const WithAllFieldErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                messagesPerField: {
                    existsError: () => true,
                    get: (fieldName: string) => {
                        const errors: Record<string, string> = {
                            password: "Current password is required",
                            "password-new": "New password is required",
                            "password-confirm": "Password confirmation is required"
                        };
                        return errors[fieldName] || "";
                    }
                }
            }}
        />
    )
};
