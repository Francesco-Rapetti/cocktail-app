import { View as ThemedView } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurContainer from "../UI/BlurContainer";
import IconButton from "../UI/IconButton";
import SkeletonIcon from "../UI/SkeletonLoading/SkeletonIcon";
import SkeletonText from "../UI/SkeletonLoading/SkeletonText";

const SKELETON_ITEMS = Array(5).fill(0);

export default function SkeletonCocktailDetail() {
	const router = useRouter();
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();

	const themeColors = Colors[theme];

	const dynamicStyles = useMemo(
		() =>
			StyleSheet.create({
				contentSection: {
					backgroundColor: themeColors.background,
					paddingBottom:
						insets.bottom + 16 + (Platform.OS === "ios" ? 0 : 10),
				},
			}),
		[themeColors.background, insets.bottom],
	);

	return (
		<ThemedView
			style={[
				styles.container,
				{ backgroundColor: themeColors.background },
			]}>
			<View style={styles.backgroundIconWrapper}>
				<SkeletonIcon
					icon={
						<FontAwesome5
							name="cocktail"
							size={56}
							color={themeColors.primaryText}
						/>
					}
				/>
			</View>

			<View style={styles.headerButtons}>
				<BlurContainer style={styles.iconContainer}>
					<IconButton
						onPress={() => router.back()}
						icon={
							<Entypo
								name="chevron-left"
								size={24}
								color={themeColors.text}
							/>
						}
					/>
				</BlurContainer>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ flexGrow: 1 }}>
				<View style={styles.heroSection}>
					<View style={styles.heroTextContent}>
						<SkeletonText
							colorOuter={themeColors.surface}
							colorInner={themeColors.primaryText}
							width="70%"
							height={24}
						/>
						<SkeletonText
							colorOuter={themeColors.surface}
							colorInner={themeColors.text}
							width="40%"
							height={16}
						/>
						<SkeletonText
							colorOuter={themeColors.surface}
							colorInner={themeColors.text}
							width="30%"
							height={20}
						/>
					</View>
				</View>

				<View
					style={[
						styles.contentContainer,
						dynamicStyles.contentSection,
					]}>
					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.primaryText, marginTop: 0 },
						]}>
						Ingredienti
					</Text>

					<View
						style={[
							styles.card,
							{ backgroundColor: themeColors.surface },
						]}>
						{SKELETON_ITEMS.map((_, index) => (
							<View key={index} style={styles.ingredientRow}>
								<SkeletonText
									colorOuter={themeColors.surface}
									colorInner={themeColors.primaryText}
									width="40%"
									height={16}
								/>

								<SkeletonText
									colorOuter={themeColors.surface}
									colorInner={themeColors.text}
									width="20%"
									height={16}
								/>
							</View>
						))}
					</View>

					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.primaryText, marginTop: 16 },
						]}>
						Preparazione
					</Text>

					<View style={styles.preparationContainer}>
						<SkeletonText
							colorOuter={themeColors.surface}
							colorInner={themeColors.text}
							width="100%"
							height={16}
						/>
						<SkeletonText
							colorOuter={themeColors.surface}
							colorInner={themeColors.text}
							width="60%"
							height={16}
						/>
					</View>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundIconWrapper: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1,
	},
	headerButtons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		position: "absolute",
		top: Constants.statusBarHeight + 24,
		height: 45,
		left: 24,
		right: 24,
		zIndex: 10,
	},
	iconContainer: {
		borderRadius: 9999,
		height: "100%",
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
		boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
	},
	scrollView: {
		flex: 1,
		zIndex: 1,
	},
	heroSection: {
		width: "100%",
		aspectRatio: 1,
		position: "relative",
	},
	heroTextContent: {
		position: "absolute",
		bottom: -10,
		left: 16,
		zIndex: 10,
		right: 16,
		gap: 12,
	},
	contentContainer: {
		flex: 1,
		paddingTop: 46,
	},
	sectionTitle: {
		fontSize: 24,
		marginHorizontal: 16,
		fontWeight: "bold",
	},
	card: {
		margin: 16,
		borderRadius: 24,
		padding: 16,
		boxShadow: `0 5px 10px rgba(0,0,0,0.1)`,
		gap: 12,
	},
	ingredientRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	preparationContainer: {
		marginHorizontal: 16,
		marginTop: 16,
		gap: 12,
	},
});
