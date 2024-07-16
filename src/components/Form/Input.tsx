import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
}

export function Input({ name, ...props }: InputProps) {
    const { register } = useFormContext();

    return (
        <input
            {...register(name)}
            {...props}
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
        />
    );
}
