import { useFormContext } from 'react-hook-form';

interface ErrorMessageProps {
    name: string;
}

export function ErrorMessage({ name }: ErrorMessageProps) {
    const { formState: { errors } } = useFormContext();
    const error = errors[name];

    if (!error) {
        return null;
    }

    return (
        <span className="text-red-500 text-sm">{error.message?.toString()}</span>
    );
}
