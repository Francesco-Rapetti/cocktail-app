import SkeletonCocktailDetail from "@/components/CocktailDetail/SkeletonCocktailDetail";
import { FavoriteIcon } from "@/components/icons/FavouriteIcon";
import BlurContainer from "@/components/UI/BlurContainer";
import IconButton from "@/components/UI/IconButton";
import { View as ThemedView } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { useCocktails } from "@/hooks/useCocktails";
import { useAppStore } from "@/stores/AppStore";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useMemo } from "react";
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CocktailDetail() {
	const params = useSearchParams();
	const router = useRouter();
	const idDrink = params.get("id");
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();

	const themeColors = Colors[theme];

	const { cocktail, loading, error, getCocktailById, getRandomCocktails } =
		useCocktails();
	const { toggleFavorite } = useAppStore();

	useEffect(() => {
		if (idDrink) {
			getCocktailById(idDrink);
		} else {
			getRandomCocktails(1);
		}
	}, [idDrink]);

	const { ingredientsArray, measuresArray } = useMemo(() => {
		const ingredients: string[] = [];
		const measures: string[] = [];

		if (cocktail) {
			for (let i = 1; i <= 15; i++) {
				const ingredient =
					cocktail[`strIngredient${i}` as keyof typeof cocktail];
				const measure =
					cocktail[`strMeasure${i}` as keyof typeof cocktail];

				if (
					typeof ingredient === "string" &&
					ingredient.trim() !== ""
				) {
					ingredients.push(ingredient.trim());
					measures.push(
						typeof measure === "string" ? measure.trim() : "",
					);
				}
			}
		}
		return { ingredientsArray: ingredients, measuresArray: measures };
	}, [cocktail]);

	const contentSectionStyle = useMemo(
		() => [
			styles.contentSection,
			{
				backgroundColor: themeColors.background,
				paddingBottom:
					insets.bottom + 16 + (Platform.OS === "ios" ? 0 : 10),
			},
		],
		[themeColors.background, insets.bottom],
	);

	if (loading || !cocktail) {
		return <SkeletonCocktailDetail />;
	}

	return (
		<ThemedView
			style={[
				styles.container,
				{ backgroundColor: themeColors.background },
			]}>
			<View style={styles.absoluteBackground}>
				{cocktail.strDrinkThumb && (
					<Image
						source={{ uri: cocktail.strDrinkThumb }}
						style={styles.heroImage}
						resizeMode="cover"
					/>
				)}
				<LinearGradient
					colors={["transparent", themeColors.background]}
					style={styles.heroGradientBottom}
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

				<BlurContainer style={styles.iconContainer}>
					<IconButton
						onPress={() => toggleFavorite(cocktail)}
						icon={<FavoriteIcon id={cocktail.idDrink} size={20} />}
					/>
				</BlurContainer>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ flexGrow: 1 }}>
				<View style={styles.heroSpacer}>
					<LinearGradient
						colors={["transparent", themeColors.background]}
						style={styles.spacerGradientBottom}
					/>

					<View style={styles.titleWrapper}>
						<Text
							style={[
								styles.titleText,
								{ color: themeColors.primaryText },
							]}>
							{cocktail.strDrink}
						</Text>
						<Text
							style={[
								styles.subtitleText,
								{ color: themeColors.text },
							]}>
							{cocktail.strCategory} - {cocktail.strAlcoholic}
						</Text>

						<View
							style={[
								styles.glassBadge,
								{ backgroundColor: themeColors.tint },
							]}>
							<FontAwesome5
								name="glass-martini-alt"
								size={12}
								color={themeColors.background}
							/>
							<Text
								style={[
									styles.glassBadgeText,
									{ color: themeColors.background },
								]}>
								{cocktail.strGlass}
							</Text>
						</View>
					</View>
				</View>

				<View style={contentSectionStyle}>
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
						{ingredientsArray.map((ingredient, index) => (
							<View key={index} style={styles.ingredientRow}>
								<Text
									style={[
										styles.ingredientText,
										{ color: themeColors.primaryText },
									]}>
									{ingredient}
								</Text>
								<Text
									style={[
										styles.measureText,
										{ color: themeColors.text },
									]}>
									{measuresArray[index]}
								</Text>
							</View>
						))}
					</View>

					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.primaryText },
						]}>
						Preparazione
					</Text>

					<View style={styles.instructionsContainer}>
						<Text
							style={[
								styles.instructionsText,
								{ color: themeColors.text },
							]}>
							{cocktail.strInstructionsIT ||
								cocktail.strInstructions}
						</Text>
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
	absoluteBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	heroImage: {
		width: "100%",
		aspectRatio: 1,
	},
	heroGradientBottom: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 50,
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
	},
	heroSpacer: {
		width: "100%",
		aspectRatio: 1,
		position: "relative",
	},
	spacerGradientBottom: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 100,
	},
	titleWrapper: {
		position: "absolute",
		bottom: -10,
		left: 16,
		right: 16,
		zIndex: 10,
	},
	titleText: {
		fontSize: 32,
		fontWeight: "bold",
	},
	subtitleText: {
		fontSize: 16,
		marginTop: 4,
	},
	glassBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 8,
		borderRadius: 9999,
		paddingHorizontal: 12,
		paddingVertical: 4,
		alignSelf: "flex-start",
	},
	glassBadgeText: {
		fontSize: 12,
		fontWeight: "500",
	},
	contentSection: {
		flex: 1,
		paddingTop: 46,
	},
	sectionTitle: {
		fontSize: 24,
		marginHorizontal: 16,
		marginTop: 16,
		fontWeight: "bold",
	},
	card: {
		margin: 16,
		borderRadius: 24,
		padding: 16,
		boxShadow: `0 5px 10px rgba(0,0,0,0.1)`,
	},
	ingredientRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	ingredientText: {
		fontSize: 16,
		fontWeight: "500",
		flex: 1,
	},
	measureText: {
		fontSize: 16,
		textAlign: "right",
	},
	instructionsContainer: {
		marginHorizontal: 16,
		marginTop: 8,
	},
	instructionsText: {
		fontSize: 16,
		lineHeight: 24,
	},
});
