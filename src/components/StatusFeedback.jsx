import { X } from "lucide-react";
import { useEffect, useState } from "react";

const StatusFeedback = ({
	type,
	message,
	onClose,
	duration = 3000,
	}) => {
	const [visible, setVisible] = useState(true);
	const isLoading = type === "loading";

	useEffect(() => {
		setVisible(true);

		if (isLoading) return;

		const timer = setTimeout(() => {
		setVisible(false);
		onClose?.();
		}, duration);

		return () => clearTimeout(timer);
	}, [isLoading, onClose, duration, message, type]);

	if (!visible) return null;

	const handleClose = () => {
		setVisible(false);
		onClose?.();
	};

	return (
		<div
		className={`fixed bottom-3 right-3 z-50 w-50 md:w-80  px-5 py-4 rounded-2xl backdrop-blur-md border shadow-2xl text-xs md:text-md flex items-center gap-3 animate-slideIn
			
			${
			isLoading
				? "bg-green-500/20 border-green-400/30 text-green-200"
				: "bg-red-500/20 border-red-400/30 text-red-200"
			}
		`}
		>
		<span className="text-xl mt-0.5">
			{isLoading ? "⏳" : "⚠️"}
		</span>

		<div className="flex-1">
			<p className="font-medium">
			{isLoading
				? message || "Cargando..."
				: `Error: ${message || "Algo salió mal"}`}
			</p>
		</div>

		<button
			onClick={onClose}
			className="
			text-white/70 hover:text-white
			transition cursor-pointer
			"
		>
			<X size={18} />
		</button>
		</div>
	);
};

export default StatusFeedback;