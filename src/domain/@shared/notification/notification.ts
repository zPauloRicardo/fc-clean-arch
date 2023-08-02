export type NotificationErrorProps = {
    message: string;
    context: string;
}

export default class Notification {
    private errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps) {
        this.errors.push(error);
    }

    getErrors(): NotificationErrorProps[] {
        return this.errors;
    }

    messages(context?: string): string {
        let message = "";
        this.errors
            .filter(value => context === undefined || value.context === context)
            .forEach(value => message += `${value.context}: ${value.message},`);
        return message;
    }

    hasErrors() {
        return this.errors.length > 0;
    }
}