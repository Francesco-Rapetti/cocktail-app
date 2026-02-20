import { FavoriteIcon } from "@/components/icons/FavouriteIcon";
import Colors from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import BlurContainer from "../BlurContainer";
import IconButton from "../IconButton";
import Pressable from "../Pressable";

const Card = ({
	uri,
	title,
	subtitle,
	drinkId,
	onFavouritePress,
	onPress,
	height = 250,
	fontSize = 20,
}: {
	uri?: string;
	title?: string;
	subtitle?: string;
	drinkId?: string;
	onFavouritePress: () => void;
	onPress: () => void;
	height?: number;
	fontSize?: number;
}) => {
	const theme = useColorScheme() ?? "light";

	const hasSubtitle = subtitle && subtitle.trim().length > 0;

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.container,
				{ backgroundColor: Colors[theme].surface, height: height },
			]}>
			<Image source={{ uri: uri }} style={[styles.image]} />

			<BlurContainer style={styles.blurContainer}>
				<View style={styles.overlayContent}>
					<View style={styles.textContainer}>
						<Text
							numberOfLines={hasSubtitle ? 1 : 2}
							style={[
								styles.title,
								{
									color: Colors[theme].primaryText,
									fontSize: fontSize,
									textAlignVertical: hasSubtitle
										? "auto"
										: "center",
								},
							]}>
							{title}
						</Text>

						{/* Mostriamo il sottotitolo solo se esiste */}
						{hasSubtitle && (
							<Text
								numberOfLines={2}
								style={{
									color: Colors[theme].text,
									fontSize: fontSize * 0.7,
								}}>
								{subtitle}
							</Text>
						)}
					</View>

					<View style={styles.iconContainer}>
						<IconButton
							onPress={onFavouritePress}
							icon={
								<FavoriteIcon
									id={drinkId}
									size={fontSize * 1.2}
								/>
							}
						/>
					</View>
				</View>
			</BlurContainer>
		</Pressable>
	);
};

export default Card;

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
		overflow: "hidden",
	},
	image: { width: "100%", height: "100%", borderRadius: 8 },
	overlayContent: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	textContainer: { flex: 1, justifyContent: "center" },
	iconContainer: { padding: 4, marginLeft: 8 },
	blurContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	title: { fontWeight: "bold" },
});
