import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import BlurContainer from "../BlurContainer";
import IconButton from "../IconButton";
import Pressable from "../Pressable";

const JumboCard = ({
	uri,
	title,
	subtitle,
	isFavourite,
	onFavouritePress,
	onPress,
}: {
	uri: string;
	title: string;
	subtitle: string;
	isFavourite: boolean;
	onFavouritePress: () => void;
	onPress: () => void;
}) => {
	const theme = useColorScheme() ?? "light";

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.container,
				{ backgroundColor: Colors[theme].surface },
			]}>
			<Image
				source={{
					uri: uri,
				}}
				style={[styles.image]}
			/>

			<BlurContainer style={styles.blurContainer}>
				<View style={styles.overlayContent}>
					<View style={styles.textContainer}>
						<Text
							numberOfLines={1}
							style={[
								styles.title,
								{
									color: Colors[theme].primaryText,
								},
							]}>
							{title}
						</Text>
						<Text
							numberOfLines={2}
							style={[
								styles.subtitle,
								{
									color: Colors[theme].text,
								},
							]}>
							{subtitle}
						</Text>
					</View>
					<View style={styles.iconContainer}>
						<IconButton
							onPress={onFavouritePress}
							activeIcon={
								<FontAwesome
									name="heart"
									size={24}
									color={Colors[theme].tint}
								/>
							}
							inactiveIcon={
								<FontAwesome
									name="heart-o"
									size={24}
									color={Colors[theme].tint}
								/>
							}
							isActive={isFavourite}
						/>
					</View>
				</View>
			</BlurContainer>
		</Pressable>
	);
};

export default JumboCard;

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
		height: 250,
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
	title: { fontWeight: "bold", fontSize: 20 },
	subtitle: { fontSize: 14 },
});
