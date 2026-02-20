import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card/Card";
import SkeletonCard from "@/components/UI/Card/SkeletonCard";
import Carousel from "@/components/UI/Carousel/Carousel";
import { Text } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { useCocktails } from "@/hooks/useCocktails";
import { useAppStore } from "@/stores/AppStore";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
	Platform,
	RefreshControl,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const {
		cocktails: randomCocktails,
		loading: randomCocktailsLoading,
		error: randomCocktailsError,
		getRandomCocktails,
	} = useCocktails();

	const {
		cocktails: cocktailsByCategory,
		loading: cocktailsByCategoryLoading,
		error: cocktailsByCategoryError,
		filterCocktailsByCategory,
	} = useCocktails();
	const [randomCategory, setRandomCategory] = useState<string | null>(null);

	const {
		cocktails: cocktailsByIngredient,
		loading: cocktailsByIngredientLoading,
		error: cocktailsByIngredientError,
		filterCocktailsByIngredient,
	} = useCocktails();
	const [randomIngredient, setRandomIngredient] = useState<string | null>(
		null,
	);

	const {
		cocktails: cocktailsByGlass,
		loading: cocktailsByGlassLoading,
		error: cocktailsByGlassError,
		filterCocktailsByGlass,
	} = useCocktails();
	const [randomGlass, setRandomGlass] = useState<string | null>(null);

	const {
		cocktails: cocktailsByAlcoholicFilter,
		loading: cocktailsByAlcoholicFilterLoading,
		error: cocktailsByAlcoholicFilterError,
		filterCocktailsByAlcoholic,
	} = useCocktails();
	const [randomAlcoholicFilter, setRandomAlcoholicFilter] = useState<
		string | null
	>(null);

	const {
		categories,
		ingredients,
		favorites,
		alcoholicFilters,
		glasses,
		toggleFavorite,
	} = useAppStore();

	const init = async () => {
		await getRandomCocktails(5);
		const randomCategory =
			categories[Math.floor(Math.random() * categories.length)];
		if (randomCategory) {
			filterCocktailsByCategory(randomCategory, true, 5);
			setRandomCategory(randomCategory);
		}
		const randomIngredient =
			ingredients[Math.floor(Math.random() * ingredients.length)];
		if (randomIngredient) {
			filterCocktailsByIngredient(randomIngredient, true, 5);
			setRandomIngredient(randomIngredient);
		}
		const randomGlass = glasses[Math.floor(Math.random() * glasses.length)];
		if (randomGlass) {
			filterCocktailsByGlass(randomGlass, true, 5);
			setRandomGlass(randomGlass);
		}
		const randomAlcoholicFilter =
			alcoholicFilters[
				Math.floor(Math.random() * alcoholicFilters.length)
			];
		if (randomAlcoholicFilter) {
			filterCocktailsByAlcoholic(randomAlcoholicFilter, true, 5);
			setRandomAlcoholicFilter(randomAlcoholicFilter);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await init();
		setRefreshing(false);
	};

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		console.log("[TabOneScreen] Favorites updated:", favorites);
	}, [favorites]);

	const renderHeader = useMemo(
		() => (title: string, link: string, onPress: () => void) => (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 10,
					paddingHorizontal: 20,
					gap: 6,
				}}>
				<Text
					maxFontSizeMultiplier={1}
					style={{
						fontSize: 22,
						fontWeight: "bold",
					}}>
					{title}
				</Text>

				{link.length > 0 && (
					<TouchableOpacity
						activeOpacity={0.6}
						onPress={onPress}
						disabled={link.length === 0 || !onPress}
						style={{
							flexShrink: 1,
							justifyContent: "center",
						}}>
						<Text
							maxFontSizeMultiplier={1}
							numberOfLines={1}
							style={{
								color: Colors[theme].tint,
								fontSize: 22,
								fontWeight: "bold",
								flexWrap: "wrap",
							}}>
							{link}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		),
		[randomCategory, randomIngredient, randomGlass, randomAlcoholicFilter],
	);

	return (
		<>
			<StatusBar style={theme === "dark" ? "light" : "dark"} />
			<View
				style={{
					marginTop: Constants.statusBarHeight + 10,
					backgroundColor: Colors[theme].surface,
					paddingHorizontal: 16,
					paddingVertical: 6,
					alignItems: "center",
					justifyContent: "space-between",
					flexDirection: "row",
				}}>
				<Text style={styles.title}>Home</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
					}}>
					<Button
						IconRight={() => (
							<FontAwesome5
								name="cocktail"
								size={22}
								color={Colors[theme].background}
							/>
						)}
						label="Stupiscimi"
						onPress={() => {}}
						backgroundColor={Colors[theme].tint}
						labelColor={Colors[theme].background}
					/>
				</View>
			</View>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={Colors[theme].tint}
						colors={[Colors[theme].tint]}
						progressBackgroundColor={Colors[theme].surface}
						title="Aggiorno le informazioni..."
						titleColor={Colors[theme].tint}
					/>
				}
				style={[
					styles.container,
					{
						zIndex: 1,
					},
				]}>
				<View
					style={{
						minHeight: "100%",
						backgroundColor: Colors[theme].background,
						borderTopLeftRadius: 18,
						borderTopRightRadius: 18,
						marginTop: 10,
						boxShadow: `0 0 10px rgba(0,0,0,0.1)`,
						paddingVertical: 16,
						paddingBottom:
							insets.bottom +
							16 +
							(Platform.OS === "ios" ? 100 : 120),
					}}>
					<Carousel
						data={
							randomCocktails && randomCocktails.length > 0
								? randomCocktails
								: ([1, 2, 3] as any[])
						}
						renderItem={({ item }) =>
							item || !randomCocktailsLoading ? (
								<Card
									title={item.strDrink}
									subtitle={item.strCategory}
									uri={item.strDrinkThumb}
									onFavouritePress={() =>
										toggleFavorite({
											idDrink: item.idDrink,
											strDrink: item.strDrink,
											strDrinkThumb: item.strDrinkThumb,
										})
									}
									drinkId={item.idDrink}
									onPress={() => {}}
								/>
							) : (
								<SkeletonCard />
							)
						}
						loop={!randomCocktailsLoading}
						autoplay={!randomCocktailsLoading}
						slideCentered
						autoplayInterval={10000}
						dotsVisible
					/>

					<View style={{ marginTop: 32 }}>
						<Carousel
							header={renderHeader(
								`Drink per categoria`,
								randomCategory || "",
								() => {},
							)}
							data={
								cocktailsByCategoryLoading
									? ([1, 2, 3] as any[])
									: cocktailsByCategory
							}
							renderItem={({ item }) =>
								item || cocktailsByCategoryLoading ? (
									<Card
										title={item.strDrink}
										uri={item.strDrinkThumb}
										onPress={() => {}}
										drinkId={item.idDrink}
										onFavouritePress={() =>
											toggleFavorite({
												idDrink: item.idDrink,
												strDrink: item.strDrink,
												strDrinkThumb:
													item.strDrinkThumb,
											})
										}
										height={200}
										fontSize={17}
									/>
								) : (
									<SkeletonCard height={200} />
								)
							}
							itemWidth={200}
							freeSlide
						/>
					</View>

					<View style={{ marginTop: 32 }}>
						<Carousel
							header={renderHeader(
								`Drink per ingrediente`,
								randomIngredient || "",
								() => {},
							)}
							data={
								cocktailsByIngredientLoading
									? ([1, 2, 3] as any[])
									: cocktailsByIngredient
							}
							renderItem={({ item }) =>
								item || cocktailsByIngredientLoading ? (
									<Card
										title={item.strDrink}
										uri={item.strDrinkThumb}
										onPress={() => {}}
										drinkId={item.idDrink}
										onFavouritePress={() =>
											toggleFavorite({
												idDrink: item.idDrink,
												strDrink: item.strDrink,
												strDrinkThumb:
													item.strDrinkThumb,
											})
										}
										height={200}
										fontSize={17}
									/>
								) : (
									<SkeletonCard height={200} />
								)
							}
							itemWidth={200}
							freeSlide
						/>
					</View>

					<View style={{ marginTop: 32 }}>
						<Carousel
							header={renderHeader(
								`Drink per bicchiere`,
								randomGlass || "",
								() => {},
							)}
							data={
								cocktailsByGlassLoading
									? ([1, 2, 3] as any[])
									: cocktailsByGlass
							}
							renderItem={({ item }) =>
								item || cocktailsByGlassLoading ? (
									<Card
										title={item.strDrink}
										uri={item.strDrinkThumb}
										onPress={() => {}}
										drinkId={item.idDrink}
										onFavouritePress={() =>
											toggleFavorite({
												idDrink: item.idDrink,
												strDrink: item.strDrink,
												strDrinkThumb:
													item.strDrinkThumb,
											})
										}
										height={200}
										fontSize={17}
									/>
								) : (
									<SkeletonCard height={200} />
								)
							}
							itemWidth={200}
							freeSlide
						/>
					</View>

					<View style={{ marginTop: 32 }}>
						<Carousel
							header={renderHeader(
								`Drink per tipo`,
								randomAlcoholicFilter || "",
								() => {},
							)}
							data={
								cocktailsByAlcoholicFilterLoading
									? ([1, 2, 3] as any[])
									: cocktailsByAlcoholicFilter
							}
							renderItem={({ item }) =>
								item || cocktailsByAlcoholicFilterLoading ? (
									<Card
										title={item.strDrink}
										uri={item.strDrinkThumb}
										onPress={() => {}}
										drinkId={item.idDrink}
										onFavouritePress={() =>
											toggleFavorite({
												idDrink: item.idDrink,
												strDrink: item.strDrink,
												strDrinkThumb:
													item.strDrinkThumb,
											})
										}
										height={200}
										fontSize={17}
									/>
								) : (
									<SkeletonCard height={200} />
								)
							}
							itemWidth={200}
							freeSlide
						/>
					</View>
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
	},
});
