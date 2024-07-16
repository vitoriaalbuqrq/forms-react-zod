interface LabelProps {
    htmlFor: string;
    children: React.ReactNode;
}

export function Label({ htmlFor, children }: LabelProps) {
    return (
        <label htmlFor={htmlFor} className="flex flex-col gap-1">
            {children}
        </label>
    );
}
