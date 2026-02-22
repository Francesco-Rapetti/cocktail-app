import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	ActivityIndicator,
	Platform,
	RefreshControl,
	StyleSheet,
	useColorScheme,
} from "react-native";
import Animated, {
	FadeIn,
	FadeOutLeft,
	LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card/Card";
import SkeletonCard from "@/components/UI/Card/SkeletonCard";
import SearchAndFilterBar, {
	FilterOption,
} from "@/components/UI/SearchAndFilterBar";
import SortButton from "@/components/UI/SortButton";
import { Text, View } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { Cocktail } from "@/entities/Cocktail";
import { useCocktails } from "@/hooks/useCocktails";
import { useAppStore } from "@/stores/AppStore";
import { InitializeAppUseCase } from "@/useCases/InitializeAppUseCase";
import {
	Feather,
	FontAwesome5,
	FontAwesome6,
	MaterialIcons,
} from "@expo/vector-icons";

const ALPHABET_AZ = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
const ALPHABET_ZA = "zyxwvutsrqponmlkjihgfedcba9876543210".split("");

const EmptyExploreState = memo(
	({
		error,
		onRetry,
		themeColors,
	}: {
		error: string | null;
		onRetry: () => void;
		themeColors: any;
	}) => (
		<Animated.View
			entering={FadeIn.duration(400).delay(200)}
			style={styles.emptyContainer}>
			{error ? (
				<>
					<Feather
						name="wifi-off"
						size={48}
						color={themeColors.tint}
						style={{ marginBottom: 16 }}
					/>
					<Text style={styles.emptyTitle}>Nessuna connessione</Text>
					<Text style={styles.emptySubtitle}>
						Impossibile caricare i cocktail in questo momento.
						Controlla la rete e riprova!
					</Text>
					<View style={{ marginTop: 16 }}>
						<Button
							label="Riprova"
							onPress={onRetry}
							backgroundColor={themeColors.tint}
							labelColor={themeColors.background}
						/>
					</View>
				</>
			) : (
				<>
					<Text style={styles.emptyTitle}>Nessun drink trovato</Text>
					<Text style={styles.emptySubtitle}>
						Prova a cercare un cocktail specifico o applica un
						filtro per trovare qualcosa di interessante!
					</Text>
				</>
			)}
		</Animated.View>
	),
);

export default function Explore() {
	const theme = useColorScheme() ?? "light";
	const colors = Colors[theme];
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const {
		toggleFavorite,
		categories,
		ingredients,
		glasses,
		alcoholicFilters,
	} = useAppStore();

	const [refreshing, setRefreshing] = useState(false);

	const [searchText, setSearchText] = useState("");
	const [activeFilterCategory, setActiveFilterCategory] = useState<
		string | null
	>(null);
	const [selectedFilterValue, setSelectedFilterValue] = useState<
		string | null
	>(null);

	const [isAscending, setIsAscending] = useState(true);
	const [letterIndex, setLetterIndex] = useState(0);

	const {
		cocktails,
		loading,
		error,
		searchCocktailsByName,
		searchCocktailsByFirstLetter,
		filterCocktailsByAlcoholic,
		filterCocktailsByCategory,
		filterCocktailsByGlass,
		filterCocktailsByIngredient,
	} = useCocktails();

	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const filterOptions: FilterOption[] = useMemo(
		() => [
			{
				id: "alcoholic",
				label: "Alcolico",
				data: alcoholicFilters || [],
				icon: (
					<FontAwesome5
						name="cocktail"
						size={24}
						color={colors.background}
					/>
				),
			},
			{
				id: "category",
				label: "Categoria",
				data: categories || [],
				icon: (
					<MaterialIcons
						name="category"
						size={24}
						color={colors.background}
					/>
				),
			},
			{
				id: "ingredient",
				label: "Ingrediente",
				data: ingredients || [],
				icon: (
					<FontAwesome6
						name="lemon"
						size={24}
						color={colors.background}
					/>
				),
			},
			{
				id: "glass",
				label: "Bicchiere",
				data: glasses || [],
				icon: (
					<FontAwesome5
						name="glass-whiskey"
						size={24}
						color={colors.background}
					/>
				),
			},
		],
		[alcoholicFilters, categories, ingredients, glasses, colors],
	);

	const fetchCurrentData = useCallback(async () => {
		if (categories.length === 0) {
			const useCase = new InitializeAppUseCase();
			await useCase.execute();
		}

		if (searchText.trim().length > 0) {
			await searchCocktailsByName(searchText.trim());
		} else if (selectedFilterValue && activeFilterCategory) {
			switch (activeFilterCategory) {
				case "alcoholic":
					await filterCocktailsByAlcoholic(selectedFilterValue);
					break;
				case "category":
					await filterCocktailsByCategory(selectedFilterValue);
					break;
				case "ingredient":
					await filterCocktailsByIngredient(selectedFilterValue);
					break;
				case "glass":
					await filterCocktailsByGlass(selectedFilterValue);
					break;
			}
		} else {
			setLetterIndex(0);
			const letters = isAscending ? ALPHABET_AZ : ALPHABET_ZA;
			await searchCocktailsByFirstLetter(letters[0], false);
		}
	}, [
		categories.length,
		searchText,
		selectedFilterValue,
		activeFilterCategory,
		isAscending,
		searchCocktailsByName,
		filterCocktailsByAlcoholic,
		filterCocktailsByCategory,
		filterCocktailsByIngredient,
		filterCocktailsByGlass,
		searchCocktailsByFirstLetter,
	]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchCurrentData();
		setRefreshing(false);
	}, [fetchCurrentData]);

	const handleSearchChange = useCallback(
		(text: string) => {
			setSearchText(text);

			if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

			searchTimerRef.current = setTimeout(() => {
				const query = text.trim();
				if (query.length > 0) searchCocktailsByName(query);
			}, 400);
		},
		[searchCocktailsByName],
	);

	const handleSearchClear = useCallback(() => {
		setSearchText("");
		if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
	}, []);

	const handleFilterSelect = useCallback(
		(categoryId: string, value: string) => {
			setActiveFilterCategory(categoryId);
			setSelectedFilterValue(value);

			switch (categoryId) {
				case "alcoholic":
					filterCocktailsByAlcoholic(value);
					break;
				case "category":
					filterCocktailsByCategory(value);
					break;
				case "ingredient":
					filterCocktailsByIngredient(value);
					break;
				case "glass":
					filterCocktailsByGlass(value);
					break;
			}
		},
		[
			filterCocktailsByAlcoholic,
			filterCocktailsByCategory,
			filterCocktailsByIngredient,
			filterCocktailsByGlass,
		],
	);

	const handleFilterClear = useCallback(() => {
		setActiveFilterCategory(null);
		setSelectedFilterValue(null);
	}, []);

	const handleToggleFavorite = useCallback(
		(item: Cocktail) => {
			toggleFavorite({
				idDrink: item.idDrink,
				strDrink: item.strDrink,
				strDrinkThumb: item.strDrinkThumb,
			});
		},
		[toggleFavorite],
	);

	const handleLoadMore = useCallback(() => {
		if (searchText.trim() !== "" || selectedFilterValue || loading) return;

		const letters = isAscending ? ALPHABET_AZ : ALPHABET_ZA;
		const nextIndex = letterIndex + 1;

		if (nextIndex < letters.length) {
			setLetterIndex(nextIndex);
			searchCocktailsByFirstLetter(letters[nextIndex], true);
		}
	}, [
		searchText,
		selectedFilterValue,
		loading,
		isAscending,
		letterIndex,
		searchCocktailsByFirstLetter,
	]);

	useEffect(() => {
		return () => {
			if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		};
	}, []);

	useEffect(() => {
		if (searchText.trim() === "" && !selectedFilterValue) {
			setLetterIndex(0);
			const letters = isAscending ? ALPHABET_AZ : ALPHABET_ZA;
			searchCocktailsByFirstLetter(letters[0], false);
		}
	}, [
		searchText,
		selectedFilterValue,
		isAscending,
		searchCocktailsByFirstLetter,
	]);

	useEffect(() => {
		if (
			!loading &&
			(!cocktails || cocktails.length === 0) &&
			searchText.trim() === "" &&
			!selectedFilterValue &&
			!error
		) {
			const letters = isAscending ? ALPHABET_AZ : ALPHABET_ZA;
			if (letterIndex < letters.length - 1) {
				handleLoadMore();
			}
		}
	}, [
		cocktails,
		loading,
		searchText,
		selectedFilterValue,
		letterIndex,
		isAscending,
		handleLoadMore,
	]);

	const renderItem = useCallback(
		({ item, index }: { item: Cocktail; index: number }) =>
			item && (!loading || letterIndex > 0) ? (
				<Animated.View
					exiting={FadeOutLeft.duration(300)}
					style={styles.cardWrapper}>
					<Card
						uri={item.strDrinkThumb}
						title={item.strDrink}
						drinkId={item.idDrink}
						onFavouritePress={() => handleToggleFavorite(item)}
						onPress={() =>
							router.push({
								pathname: "/cocktailDetail",
								params: { id: item.idDrink },
							})
						}
					/>
				</Animated.View>
			) : (
				<View style={styles.cardWrapper}>
					<SkeletonCard />
				</View>
			),
		[handleToggleFavorite, loading, letterIndex, router],
	);

	const sortedCocktails = useMemo(() => {
		if (!cocktails) return [];
		return [...cocktails].sort((a, b) => {
			if (isAscending) return a.strDrink.localeCompare(b.strDrink);
			else return b.strDrink.localeCompare(a.strDrink);
		});
	}, [cocktails, isAscending]);

	const listData = useMemo(() => {
		if (loading && sortedCocktails.length === 0 && letterIndex === 0) {
			return Array(4).fill(null) as any[];
		}
		return sortedCocktails;
	}, [loading, sortedCocktails, letterIndex]);

	const listContentStyle = useMemo(
		() => ({
			paddingBottom:
				insets.bottom + 16 + (Platform.OS === "ios" ? 100 : 120),
			marginHorizontal: 16,
			flexGrow: 1,
		}),
		[insets.bottom],
	);

	const renderFooter = () => {
		if (
			!loading ||
			letterIndex === 0 ||
			searchText.trim() !== "" ||
			selectedFilterValue
		)
			return null;
		return (
			<View style={styles.footerLoader}>
				<ActivityIndicator size="large" color={colors.tint} />
			</View>
		);
	};

	return (
		<View
			style={[
				styles.container,
				{ paddingTop: Constants.statusBarHeight + 10 },
			]}>
			<View style={styles.topBar}>
				<Text
					maxFontSizeMultiplier={1}
					numberOfLines={1}
					style={styles.title}>
					Esplora i cocktail
				</Text>

				<SortButton
					isAscending={isAscending}
					onToggle={() => setIsAscending((prev) => !prev)}
					backgroundColor={colors.tint}
					color={colors.background}
				/>
			</View>

			<SearchAndFilterBar
				colors={colors}
				searchValue={searchText}
				onSearchChange={handleSearchChange}
				onSearchClear={handleSearchClear}
				filterOptions={filterOptions}
				selectedFilterValue={selectedFilterValue}
				onFilterSelect={handleFilterSelect}
				onFilterClear={handleFilterClear}
			/>

			<Animated.FlatList
				data={listData}
				contentContainerStyle={listContentStyle}
				keyExtractor={(item, index) =>
					item?.idDrink ? item.idDrink : `skeleton-${index}`
				}
				renderItem={renderItem}
				ListEmptyComponent={
					<EmptyExploreState
						error={error}
						onRetry={fetchCurrentData}
						themeColors={colors}
					/>
				}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.tint}
						colors={[colors.tint]}
						progressBackgroundColor={colors.surface}
						title="Aggiorno i drink..."
						titleColor={colors.tint}
					/>
				}
				itemLayoutAnimation={LinearTransition.springify()}
				initialNumToRender={8}
				maxToRenderPerBatch={10}
				windowSize={5}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.5}
				ListFooterComponent={renderFooter}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 6,
	},
	topBar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		margin: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	emptySubtitle: {
		fontSize: 16,
		opacity: 0.7,
		textAlign: "center",
		lineHeight: 24,
	},
	cardWrapper: {
		marginBottom: 24,
	},
	footerLoader: {
		paddingVertical: 20,
		alignItems: "center",
		justifyContent: "center",
	},
});
