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
import React, { useEffect, useState } from "react";
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
	const [ingredientsArray, setIngredientsArray] = useState<string[]>([]);
	const [measuresArray, setMeasuresArray] = useState<string[]>([]);

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

	useEffect(() => {
		if (cocktail) {
			const ingredients: string[] = [];
			const measures: string[] = [];

			for (let i = 1; i <= 15; i++) {
				const ingredientKey =
					`strIngredient${i}` as keyof typeof cocktail;
				const measureKey = `strMeasure${i}` as keyof typeof cocktail;

				const ingredient = cocktail[ingredientKey];
				const measure = cocktail[measureKey];

				if (
					typeof ingredient === "string" &&
					ingredient.trim() !== ""
				) {
					ingredients.push(ingredient);
				}
				if (typeof measure === "string" && measure.trim() !== "") {
					measures.push(measure);
				}
			}

			setIngredientsArray(ingredients);
			setMeasuresArray(measures);
		}
	}, [cocktail]);

	return (
		<ThemedView
			style={[
				styles.container,
				{ backgroundColor: Colors[theme].background },
			]}>
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
				}}>
				{cocktail?.strDrinkThumb && (
					<Image
						source={{ uri: cocktail.strDrinkThumb }}
						style={{ width: "100%", aspectRatio: 1 }}
						resizeMode="cover"
					/>
				)}
				<LinearGradient
					colors={["transparent", Colors[theme].background]}
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						bottom: 0,
						height: 50,
					}}
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
								color={Colors[theme].text}
							/>
						}
					/>
				</BlurContainer>

				{cocktail && (
					<BlurContainer style={styles.iconContainer}>
						<IconButton
							onPress={() => toggleFavorite(cocktail)}
							icon={
								<FavoriteIcon id={cocktail.idDrink} size={20} />
							}
						/>
					</BlurContainer>
				)}
			</View>

			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}>
				<View
					style={{
						width: "100%",
						aspectRatio: 1,
						position: "relative",
					}}>
					<LinearGradient
						colors={["transparent", Colors[theme].background]}
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							height: 100,
						}}
					/>

					<View
						style={{
							position: "absolute",
							bottom: -10,
							left: 16,
							zIndex: 10,
						}}>
						<Text
							style={{
								color: Colors[theme].primaryText,
								fontSize: 32,
								fontWeight: "bold",
							}}>
							{cocktail?.strDrink}
						</Text>
						<Text
							style={{ color: Colors[theme].text, fontSize: 16 }}>
							{cocktail?.strCategory} - {cocktail?.strAlcoholic}
						</Text>
						<View
							style={[
								styles.glassBadge,
								{ backgroundColor: Colors[theme].tint },
							]}>
							<FontAwesome5
								name="glass-martini-alt"
								size={12}
								color={Colors[theme].background}
							/>
							<Text
								style={{
									color: Colors[theme].background,
									fontSize: 12,
								}}>
								{cocktail?.strGlass}
							</Text>
						</View>
					</View>
				</View>

				<View
					style={{
						backgroundColor: Colors[theme].background,
						flex: 1,
						paddingTop: 46,
						paddingBottom:
							insets.bottom +
							16 +
							(Platform.OS === "ios" ? 0 : 10),
					}}>
					<Text
						style={[
							styles.sectionTitle,
							{ color: Colors[theme].primaryText, marginTop: 0 },
						]}>
						Ingredienti
					</Text>

					<View
						style={[
							styles.card,
							{ backgroundColor: Colors[theme].surface },
						]}>
						{ingredientsArray.map((ingredient, index) => (
							<View key={index} style={styles.ingredientRow}>
								<Text
									style={{
										color: Colors[theme].primaryText,
										fontSize: 16,
										fontWeight: "500",
									}}>
									{ingredient}
								</Text>
								<Text
									style={{
										color: Colors[theme].text,
										fontSize: 16,
									}}>
									{measuresArray[index] || ""}
								</Text>
							</View>
						))}
					</View>

					<Text
						style={[
							styles.sectionTitle,
							{ color: Colors[theme].primaryText, marginTop: 16 },
						]}>
						Preparazione
					</Text>

					<View style={{ marginHorizontal: 16, marginTop: 8 }}>
						<Text
							style={{
								color: Colors[theme].text,
								fontSize: 16,
								lineHeight: 24,
							}}>
							{cocktail?.strInstructionsIT ||
								cocktail?.strInstructions}
						</Text>
					</View>
				</View>

				<View
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						height: 1000,
						backgroundColor: Colors[theme].background,
					}}
				/>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
});
