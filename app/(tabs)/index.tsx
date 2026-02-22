import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card/Card";
import SkeletonCard from "@/components/UI/Card/SkeletonCard";
import Carousel from "@/components/UI/Carousel/Carousel";
import { Text } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { useCocktails } from "@/hooks/useCocktails";
import { useAppStore } from "@/stores/AppStore";
import { InitializeAppUseCase } from "@/useCases/InitializeAppUseCase";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
const TODO = () => {};

const ErrorState = memo(
	({ onRetry, theme }: { onRetry: () => void; theme: "light" | "dark" }) => (
		<View style={styles.errorContainer}>
			<FontAwesome5
				name="wifi"
				size={48}
				color={Colors[theme].tint}
				style={{ marginBottom: 16 }}
			/>
			<Text style={styles.errorTitle}>Nessuna connessione</Text>
			<Text style={styles.errorSubtitle}>
				Impossibile caricare i cocktail in questo momento. Controlla la
				tua connessione internet e riprova.
			</Text>
			<Button
				label="Riprova"
				onPress={onRetry}
				backgroundColor={Colors[theme].tint}
				labelColor={Colors[theme].background}
			/>
		</View>
	),
);

export default function Home() {
	const theme = useColorScheme() ?? "light";
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const [hasError, setHasError] = useState(false);

	const themeColors = Colors[theme];

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
		glasses,
		alcoholicFilters,
		toggleFavorite,
	} = useAppStore();

	const init = useCallback(async () => {
		setHasError(false);

		try {
			let currentCategories = categories;
			let currentIngredients = ingredients;
			let currentGlasses = glasses;
			let currentAlcoholicFilters = alcoholicFilters;

			if (currentCategories.length === 0) {
				const useCase = new InitializeAppUseCase();
				await useCase.execute();

				const state = useAppStore.getState();
				currentCategories = state.categories;
				currentIngredients = state.ingredients;
				currentGlasses = state.glasses;
				currentAlcoholicFilters = state.alcoholicFilters;
			}

			if (currentCategories.length === 0) {
				throw new Error("Impossibile inizializzare l'app");
			}

			const cat =
				currentCategories[
					Math.floor(Math.random() * currentCategories.length)
				];
			const ing =
				currentIngredients[
					Math.floor(Math.random() * currentIngredients.length)
				];
			const gls =
				currentGlasses[
					Math.floor(Math.random() * currentGlasses.length)
				];
			const alc =
				currentAlcoholicFilters[
					Math.floor(Math.random() * currentAlcoholicFilters.length)
				];

			setRandomFilters({
				category: cat || "",
				ingredient: ing || "",
				glass: gls || "",
				alcoholic: alc || "",
			});

			await Promise.all([
				getRandomCocktails(5),
				cat
					? filterCocktailsByCategory(cat, true, 3)
					: Promise.resolve(),
				ing
					? filterCocktailsByIngredient(ing, true, 3)
					: Promise.resolve(),
				gls ? filterCocktailsByGlass(gls, true, 3) : Promise.resolve(),
				alc
					? filterCocktailsByAlcoholic(alc, true, 3)
					: Promise.resolve(),
			]);
		} catch (error) {
			setHasError(true);
		}
	}, [
		categories,
		ingredients,
		glasses,
		alcoholicFilters,
		getRandomCocktails,
		filterCocktailsByCategory,
		filterCocktailsByIngredient,
		filterCocktailsByGlass,
		filterCocktailsByAlcoholic,
	]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await init();
		setRefreshing(false);
	}, [init]);

	useEffect(() => {
		init();
	}, [init]);

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

	const handleNavigateDetail = useCallback(
		(id: string) => {
			router.push({ pathname: "/cocktailDetail", params: { id } });
		},
		[router],
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
						disabled={!onPress || onPress === TODO}
						style={styles.headerLinkContainer}>
						<Text
							maxFontSizeMultiplier={1}
							numberOfLines={1}
							style={[
								styles.headerLink,
								{ color: themeColors.tint },
							]}>
							{link}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		),
		[themeColors.tint],
	);

	const contentContainerStyle = useMemo(
		() => [
			styles.listContentContainer,
			{
				backgroundColor: themeColors.background,
				paddingBottom:
					insets.bottom + 16 + (Platform.OS === "ios" ? 100 : 120),
			},
		],
		[themeColors.background, insets.bottom],
	);

	const renderListSection = useCallback(
		({ item: section }: { item: string }) => {
			switch (section) {
				case "random":
					return (
						<Carousel
							data={
								randomCocktails?.length
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
										onPress={() =>
											handleNavigateDetail(
												carouselItem.idDrink,
											)
										}
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
									TODO,
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
											onPress={() =>
												handleNavigateDetail(
													carouselItem.idDrink,
												)
											}
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
									TODO,
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
											onPress={() =>
												handleNavigateDetail(
													carouselItem.idDrink,
												)
											}
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
									TODO,
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
											onPress={() =>
												handleNavigateDetail(
													carouselItem.idDrink,
												)
											}
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
									TODO,
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
											onPress={() =>
												handleNavigateDetail(
													carouselItem.idDrink,
												)
											}
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
			handleNavigateDetail,
			renderHeader,
		],
	);

	return (
		<View style={styles.mainWrapper}>
			<StatusBar style={theme === "dark" ? "light" : "dark"} />

			<View
				style={[
					styles.bgTopHalf,
					{ backgroundColor: themeColors.surface },
				]}
			/>
			<View
				style={[
					styles.bgBottomHalf,
					{ backgroundColor: themeColors.background },
				]}
			/>

			<View
				style={[
					styles.topBar,
					{ marginTop: Constants.statusBarHeight + 10 },
				]}>
				<Text style={styles.title}>Home</Text>
				<View style={styles.topBarAction}>
					<Button
						IconRight={() => (
							<FontAwesome5
								name="cocktail"
								size={22}
								color={themeColors.background}
							/>
						)}
						label="Stupiscimi"
						onPress={() => router.push("/cocktailDetail")}
						backgroundColor={themeColors.tint}
						labelColor={themeColors.background}
					/>
				</View>
			</View>

			{hasError ? (
				<View style={[contentContainerStyle, styles.errorWrapper]}>
					<ErrorState onRetry={init} theme={theme} />
				</View>
			) : (
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
							tintColor={themeColors.tint}
							colors={[themeColors.tint]}
							progressBackgroundColor={themeColors.surface}
							title="Aggiorno le informazioni..."
							titleColor={themeColors.tint}
						/>
					}
					style={styles.container}
					contentContainerStyle={contentContainerStyle}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	mainWrapper: {
		flex: 1,
	},
	bgTopHalf: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "50%",
	},
	bgBottomHalf: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: "50%",
	},
	container: {
		flex: 1,
		zIndex: 1,
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
		zIndex: 2,
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
		flexGrow: 1,
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		marginTop: 10,
		paddingVertical: 16,
		boxShadow: `0 -3px 10px rgba(0,0,0,0.1)`,
		elevation: 5,
	},
	errorWrapper: {
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
		flex: 1,
	},
	errorTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	errorSubtitle: {
		fontSize: 16,
		opacity: 0.7,
		textAlign: "center",
		lineHeight: 24,
		marginBottom: 24,
	},
});
