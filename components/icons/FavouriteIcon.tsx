import Colors from "@/constants/Colors";
import { useIsFavorite } from "@/hooks/useIsFavourite";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export const FavoriteIcon = ({
	id,
	size = 24,
}: {
	id?: string;
	size?: number;
}) => {
	const isFavorite = id ? useIsFavorite(id) : false;
	const theme = useColorScheme() ?? "light";

	return (
		<FontAwesome
			name={isFavorite ? "heart" : "heart-o"}
			color={isFavorite ? Colors[theme].danger : Colors[theme].tint}
			size={size}
		/>
	);
};
