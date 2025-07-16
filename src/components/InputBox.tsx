export default function InputBox({label}: {label: string}) {
    return (
        <div>
            <input className="border-2 px-2 pl-4 py-1 rounded-2xl" type="text" placeholder={label} />
        </div>
    );
}