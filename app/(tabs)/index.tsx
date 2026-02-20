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
import { useCallback, useEffect, useState } from "react";
import {
	FlatList,
	Platform,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SKELETON_DATA = [1, 2, 3] as any[];
const LIST_SECTIONS = ["random", "category", "ingredient", "glass", "type"];

export default function Home() {
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);

	const [randomFilters, setRandomFilters] = useState({
		category: "",
		ingredient: "",
		glass: "",
		alcoholic: "",
	});

	const {
		cocktails: randomCocktails,
		loading: randomCocktailsLoading,
		getRandomCocktails,
	} = useCocktails();

	const {
		cocktails: cocktailsByCategory,
		loading: cocktailsByCategoryLoading,
		filterCocktailsByCategory,
	} = useCocktails();

	const {
		cocktails: cocktailsByIngredient,
		loading: cocktailsByIngredientLoading,
		filterCocktailsByIngredient,
	} = useCocktails();

	const {
		cocktails: cocktailsByGlass,
		loading: cocktailsByGlassLoading,
		filterCocktailsByGlass,
	} = useCocktails();

	const {
		cocktails: cocktailsByAlcoholicFilter,
		loading: cocktailsByAlcoholicFilterLoading,
		filterCocktailsByAlcoholic,
	} = useCocktails();

	const {
		categories,
		ingredients,
		favorites,
		alcoholicFilters,
		glasses,
		toggleFavorite,
	} = useAppStore();

	const init = async () => {
		const cat = categories[Math.floor(Math.random() * categories.length)];
		const ing = ingredients[Math.floor(Math.random() * ingredients.length)];
		const gls = glasses[Math.floor(Math.random() * glasses.length)];
		const alc =
			alcoholicFilters[
				Math.floor(Math.random() * alcoholicFilters.length)
			];

		setRandomFilters({
			category: cat || "",
			ingredient: ing || "",
			glass: gls || "",
			alcoholic: alc || "",
		});

		await Promise.all([
			getRandomCocktails(5),
			cat ? filterCocktailsByCategory(cat, true, 3) : Promise.resolve(),
			ing ? filterCocktailsByIngredient(ing, true, 3) : Promise.resolve(),
			gls ? filterCocktailsByGlass(gls, true, 3) : Promise.resolve(),
			alc ? filterCocktailsByAlcoholic(alc, true, 3) : Promise.resolve(),
		]);
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await init();
		setRefreshing(false);
	}, [categories, ingredients, glasses, alcoholicFilters]);

	useEffect(() => {
		init();
	}, []);

	const handleToggleFavorite = useCallback(
		(item: any) => {
			toggleFavorite({
				idDrink: item.idDrink,
				strDrink: item.strDrink,
				strDrinkThumb: item.strDrinkThumb,
			});
		},
		[toggleFavorite],
	);

	const renderHeader = useCallback(
		(title: string, link: string, onPress: () => void) => (
			<View style={styles.headerContainer}>
				<Text maxFontSizeMultiplier={1} style={styles.headerTitle}>
					{title}
				</Text>
				{link.length > 0 && (
					<TouchableOpacity
						activeOpacity={0.6}
						onPress={onPress}
						disabled={!onPress}
						style={styles.headerLinkContainer}>
						<Text
							maxFontSizeMultiplier={1}
							numberOfLines={1}
							style={[
								styles.headerLink,
								{ color: Colors[theme].tint },
							]}>
							{link}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		),
		[theme],
	);

	const renderListSection = useCallback(
		({ item: section }: { item: string }) => {
			switch (section) {
				case "random":
					return (
						<Carousel
							data={
								randomCocktails && randomCocktails.length > 0
									? randomCocktails
									: SKELETON_DATA
							}
							renderItem={({ item: carouselItem }) =>
								carouselItem && !randomCocktailsLoading ? (
									<Card
										title={carouselItem.strDrink}
										subtitle={carouselItem.strCategory}
										uri={carouselItem.strDrinkThumb}
										onFavouritePress={() =>
											handleToggleFavorite(carouselItem)
										}
										drinkId={carouselItem.idDrink}
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
					);

				case "category":
					return (
						<View style={styles.sectionMargin}>
							<Carousel
								header={renderHeader(
									`Drink per categoria`,
									randomFilters.category,
									() => {},
								)}
								data={
									cocktailsByCategoryLoading
										? SKELETON_DATA
										: cocktailsByCategory
								}
								renderItem={({ item: carouselItem }) =>
									carouselItem &&
									!cocktailsByCategoryLoading ? (
										<Card
											title={carouselItem.strDrink}
											uri={carouselItem.strDrinkThumb}
											onPress={() => {}}
											drinkId={carouselItem.idDrink}
											onFavouritePress={() =>
												handleToggleFavorite(
													carouselItem,
												)
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
					);

				case "ingredient":
					return (
						<View style={styles.sectionMargin}>
							<Carousel
								header={renderHeader(
									`Drink per ingrediente`,
									randomFilters.ingredient,
									() => {},
								)}
								data={
									cocktailsByIngredientLoading
										? SKELETON_DATA
										: cocktailsByIngredient
								}
								renderItem={({ item: carouselItem }) =>
									carouselItem &&
									!cocktailsByIngredientLoading ? (
										<Card
											title={carouselItem.strDrink}
											uri={carouselItem.strDrinkThumb}
											onPress={() => {}}
											drinkId={carouselItem.idDrink}
											onFavouritePress={() =>
												handleToggleFavorite(
													carouselItem,
												)
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
					);

				case "glass":
					return (
						<View style={styles.sectionMargin}>
							<Carousel
								header={renderHeader(
									`Drink per bicchiere`,
									randomFilters.glass,
									() => {},
								)}
								data={
									cocktailsByGlassLoading
										? SKELETON_DATA
										: cocktailsByGlass
								}
								renderItem={({ item: carouselItem }) =>
									carouselItem && !cocktailsByGlassLoading ? (
										<Card
											title={carouselItem.strDrink}
											uri={carouselItem.strDrinkThumb}
											onPress={() => {}}
											drinkId={carouselItem.idDrink}
											onFavouritePress={() =>
												handleToggleFavorite(
													carouselItem,
												)
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
					);

				case "type":
					return (
						<View style={styles.sectionMargin}>
							<Carousel
								header={renderHeader(
									`Drink per tipo`,
									randomFilters.alcoholic,
									() => {},
								)}
								data={
									cocktailsByAlcoholicFilterLoading
										? SKELETON_DATA
										: cocktailsByAlcoholicFilter
								}
								renderItem={({ item: carouselItem }) =>
									carouselItem &&
									!cocktailsByAlcoholicFilterLoading ? (
										<Card
											title={carouselItem.strDrink}
											uri={carouselItem.strDrinkThumb}
											onPress={() => {}}
											drinkId={carouselItem.idDrink}
											onFavouritePress={() =>
												handleToggleFavorite(
													carouselItem,
												)
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
					);

				default:
					return null;
			}
		},
		[
			randomCocktails,
			randomCocktailsLoading,
			cocktailsByCategory,
			cocktailsByCategoryLoading,
			randomFilters.category,
			cocktailsByIngredient,
			cocktailsByIngredientLoading,
			randomFilters.ingredient,
			cocktailsByGlass,
			cocktailsByGlassLoading,
			randomFilters.glass,
			cocktailsByAlcoholicFilter,
			cocktailsByAlcoholicFilterLoading,
			randomFilters.alcoholic,
			handleToggleFavorite,
			renderHeader,
		],
	);

	return (
		<>
			<StatusBar style={theme === "dark" ? "light" : "dark"} />
			<View
				style={[
					styles.topBar,
					{
						marginTop: Constants.statusBarHeight + 10,
						backgroundColor: Colors[theme].surface,
					},
				]}>
				<Text style={styles.title}>Home</Text>
				<View style={styles.topBarAction}>
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

			<FlatList
				data={LIST_SECTIONS}
				keyExtractor={(item) => item}
				renderItem={renderListSection}
				showsVerticalScrollIndicator={false}
				initialNumToRender={2}
				windowSize={3}
				maxToRenderPerBatch={2}
				removeClippedSubviews={Platform.OS === "android"}
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
				style={[styles.container, { zIndex: 1 }]}
				contentContainerStyle={[
					styles.listContentContainer,
					{
						backgroundColor: Colors[theme].background,
						paddingBottom:
							insets.bottom +
							16 +
							(Platform.OS === "ios" ? 100 : 120),
					},
				]}
			/>
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
	topBar: {
		paddingHorizontal: 16,
		paddingVertical: 6,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	topBarAction: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	sectionMargin: {
		marginTop: 32,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		paddingHorizontal: 20,
		gap: 6,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "bold",
	},
	headerLinkContainer: {
		flexShrink: 1,
		justifyContent: "center",
	},
	headerLink: {
		fontSize: 22,
		fontWeight: "bold",
		flexWrap: "wrap",
	},
	listContentContainer: {
		minHeight: "100%",
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		marginTop: 10,
		paddingVertical: 16,
		boxShadow: `0 -3px 10px rgba(0,0,0,0.1)`,
	},
});
