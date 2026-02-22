import Button from "@/components/UI/Button";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";

interface SortButtonProps {
	isAscending: boolean;
	onToggle: () => void;
	ascLabel?: string;
	descLabel?: string;
	backgroundColor: string;
	color: string;
}

export default function SortButton({
	isAscending,
	onToggle,
	ascLabel = "A-Z",
	descLabel = "Z-A",
	backgroundColor,
	color,
}: SortButtonProps) {
	return (
		<Button
			label={isAscending ? ascLabel : descLabel}
			onPress={onToggle}
			IconLeft={() => (
				<FontAwesome6
					name={isAscending ? "arrow-down-a-z" : "arrow-up-a-z"}
					size={18}
					color={color}
				/>
			)}
			backgroundColor={backgroundColor}
			labelColor={color}
		/>
	);
}
