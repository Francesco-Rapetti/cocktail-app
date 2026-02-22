import Constants from "expo-constants";
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
	ScrollView,
	StyleSheet,
	TextInput,
	useColorScheme,
} from "react-native";
import Animated, {
	Extrapolation,
	FadeIn,
	FadeOutLeft,
	interpolate,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card/Card";
import SkeletonCard from "@/components/UI/Card/SkeletonCard";
import Pressable from "@/components/UI/Pressable";
import { Text, View } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { Cocktail } from "@/entities/Cocktail";
import { useCocktails } from "@/hooks/useCocktails";
import { useAppStore } from "@/stores/AppStore";
import {
	Entypo,
	FontAwesome5,
	FontAwesome6,
	Ionicons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ALPHABET_AZ = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
const ALPHABET_ZA = "zyxwvutsrqponmlkjihgfedcba9876543210".split("");

const EmptyFavorites = memo(() => (
	<Animated.View
		entering={FadeIn.duration(400).delay(200)}
		style={styles.emptyContainer}>
		<Text style={styles.emptyTitle}>Nessun drink trovato</Text>
		<Text style={styles.emptySubtitle}>
			Prova a cercare un cocktail specifico o applica un filtro per
			trovare qualcosa di interessante!
		</Text>
	</Animated.View>
));

const FILTER_OPTIONS = [
	{ id: "alcoholic", label: "Alcolico" },
	{ id: "category", label: "Categoria" },
	{ id: "ingredient", label: "Ingrediente" },
	{ id: "glass", label: "Bicchiere" },
];

export default function Explore() {
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const {
		toggleFavorite,
		categories,
		ingredients,
		glasses,
		alcoholicFilters,
	} = useAppStore();

	const [isSearchActive, setIsSearchActive] = useState(false);
	const [searchText, setSearchText] = useState("");
	const inputRef = useRef<TextInput>(null);

	const [isFilterActive, setIsFilterActive] = useState(false);
	const [activeFilterCategory, setActiveFilterCategory] = useState<
		string | null
	>(null);
	const [selectedFilterValue, setSelectedFilterValue] = useState<
		string | null
	>(null);

	const [isAscending, setIsAscending] = useState(true);
	const [letterIndex, setLetterIndex] = useState(0);

	const searchProgress = useSharedValue(0);
	const filterProgress = useSharedValue(0);
	const accordionProgress = useSharedValue(0);

	const {
		cocktails,
		loading,
		error,
		searchCocktailsByName,
		searchCocktailsByFirstLetter,
		clearCocktails,
		filterCocktailsByAlcoholic,
		filterCocktailsByCategory,
		filterCocktailsByGlass,
		filterCocktailsByIngredient,
	} = useCocktails();

	const openSearch = useCallback(() => {
		setIsSearchActive(true);
		searchProgress.value = withTiming(1, { duration: 500 });
		setTimeout(() => inputRef.current?.focus(), 50);
	}, [searchProgress]);

	const closeSearch = useCallback(() => {
		inputRef.current?.blur();
		setSearchText("");
		setIsSearchActive(false);
		searchProgress.value = withTiming(0, { duration: 500 });

		if (searchTimerRef.current) {
			clearTimeout(searchTimerRef.current);
		}
	}, [searchProgress]);

	const openFilter = useCallback(() => {
		setIsFilterActive(true);
		setActiveFilterCategory(null);
		filterProgress.value = withTiming(1, { duration: 500 });
		accordionProgress.value = withTiming(1, { duration: 500 });
	}, [filterProgress, accordionProgress]);

	const closeFilter = useCallback(() => {
		setIsFilterActive(false);
		setSelectedFilterValue(null);
		setActiveFilterCategory(null);
		filterProgress.value = withTiming(0, { duration: 500 });
		accordionProgress.value = withTiming(0, { duration: 500 });
	}, [filterProgress, accordionProgress]);

	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleSearchChange = useCallback(
		(text: string) => {
			setSearchText(text);

			if (searchTimerRef.current) {
				clearTimeout(searchTimerRef.current);
			}

			searchTimerRef.current = setTimeout(() => {
				const query = text.trim();
				if (query.length > 0) {
					searchCocktailsByName(query);
				}
			}, 400);
		},
		[searchCocktailsByName],
	);

	useEffect(() => {
		return () => {
			if (searchTimerRef.current) {
				clearTimeout(searchTimerRef.current);
			}
		};
	}, []);

	const toggleAccordion = useCallback(() => {
		if (accordionProgress.value === 0) {
			accordionProgress.value = withTiming(1, { duration: 400 });
		} else {
			accordionProgress.value = withTiming(0, { duration: 400 });
		}
	}, [accordionProgress]);

	const handleSelectPrimaryCategory = useCallback((id: string) => {
		setActiveFilterCategory(id);
	}, []);

	const handleSelectSubCategory = useCallback(
		(value: string) => {
			setSelectedFilterValue(value);
			accordionProgress.value = withTiming(0, { duration: 400 });

			if (activeFilterCategory === "alcoholic")
				filterCocktailsByAlcoholic(value);
			else if (activeFilterCategory === "category")
				filterCocktailsByCategory(value);
			else if (activeFilterCategory === "ingredient")
				filterCocktailsByIngredient(value);
			else if (activeFilterCategory === "glass")
				filterCocktailsByGlass(value);
		},
		[
			activeFilterCategory,
			filterCocktailsByAlcoholic,
			filterCocktailsByCategory,
			filterCocktailsByGlass,
			filterCocktailsByIngredient,
			accordionProgress,
		],
	);

	const renderAccordionContent = () => {
		if (!activeFilterCategory) {
			return FILTER_OPTIONS.map((option, index) => (
				<Pressable
					key={option.id}
					style={[
						styles.accordionOption,
						index !== FILTER_OPTIONS.length - 1 && {
							borderBottomWidth: 1,
							borderBottomColor: Colors[theme].background + "20",
						},
					]}
					onPress={() => handleSelectPrimaryCategory(option.id)}>
					<Text
						style={[
							styles.accordionText,
							{ color: Colors[theme].background },
						]}>
						{option.label}
					</Text>
					<MaterialIcons
						name="chevron-right"
						size={20}
						color={Colors[theme].background}
					/>
				</Pressable>
			));
		}

		let data: string[] = [];

		if (activeFilterCategory === "alcoholic") {
			data = alcoholicFilters || [];
		} else if (activeFilterCategory === "category") {
			data = categories || [];
		} else if (activeFilterCategory === "ingredient") {
			data = ingredients || [];
		} else if (activeFilterCategory === "glass") {
			data = glasses || [];
		}

		return (
			<ScrollView style={styles.accordionScroll} nestedScrollEnabled>
				<Pressable
					style={styles.backOption}
					onPress={() => setActiveFilterCategory(null)}>
					<MaterialIcons
						name="arrow-back"
						size={20}
						color={Colors[theme].background}
					/>
					<Text
						style={[
							styles.accordionText,
							{
								color: Colors[theme].background,
								fontWeight: "bold",
							},
						]}>
						Indietro
					</Text>
				</Pressable>

				{(data || []).map((item, index) => (
					<Pressable
						key={`${activeFilterCategory}-${index}`}
						style={[
							styles.accordionOption,
							{
								borderBottomWidth: 1,
								borderBottomColor:
									Colors[theme].background + "10",
							},
						]}
						onPress={() => handleSelectSubCategory(item)}>
						<Text
							style={[
								styles.accordionText,
								{ color: Colors[theme].background },
							]}>
							{item}
						</Text>
					</Pressable>
				))}
			</ScrollView>
		);
	};

	const searchBaseStyle = useAnimatedStyle(() => ({
		flex: 1,
		borderTopRightRadius: interpolate(
			searchProgress.value,
			[0, 1],
			[4, 50],
			Extrapolation.CLAMP,
		),
		borderBottomRightRadius: interpolate(
			searchProgress.value,
			[0, 1],
			[4, 50],
			Extrapolation.CLAMP,
		),
		maxWidth: interpolate(
			filterProgress.value,
			[0, 1],
			[2000, 0],
			Extrapolation.CLAMP,
		),
		opacity: interpolate(
			filterProgress.value,
			[0, 0.3, 1],
			[1, 0, 0],
			Extrapolation.CLAMP,
		),
	}));

	const filterContainerStyle = useAnimatedStyle(() => {
		const isAnyActive = Math.max(
			searchProgress.value,
			filterProgress.value,
		);
		return {
			flex: 1,
			borderTopLeftRadius: interpolate(
				filterProgress.value,
				[0, 1],
				[4, 50],
				Extrapolation.CLAMP,
			),
			borderBottomLeftRadius: interpolate(
				filterProgress.value,
				[0, 1],
				[4, 50],
				Extrapolation.CLAMP,
			),
			maxWidth: interpolate(
				searchProgress.value,
				[0, 1],
				[2000, 0],
				Extrapolation.CLAMP,
			),
			marginLeft: interpolate(
				isAnyActive,
				[0, 1],
				[4, 0],
				Extrapolation.CLAMP,
			),
			opacity: interpolate(
				searchProgress.value,
				[0, 0.3, 1],
				[1, 0, 0],
				Extrapolation.CLAMP,
			),
		};
	});

	const inactiveSearchRowStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			searchProgress.value,
			[0, 0.4],
			[1, 0],
			Extrapolation.CLAMP,
		),
		transform: [
			{ scale: interpolate(searchProgress.value, [0, 1], [1, 0.9]) },
		],
	}));
	const activeSearchRowStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			searchProgress.value,
			[0.6, 1],
			[0, 1],
			Extrapolation.CLAMP,
		),
		transform: [
			{ scale: interpolate(searchProgress.value, [0, 1], [0.95, 1]) },
		],
	}));

	const inactiveFilterRowStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			filterProgress.value,
			[0, 0.4],
			[1, 0],
			Extrapolation.CLAMP,
		),
		transform: [
			{ scale: interpolate(filterProgress.value, [0, 1], [1, 0.9]) },
		],
	}));
	const activeFilterRowStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			filterProgress.value,
			[0.6, 1],
			[0, 1],
			Extrapolation.CLAMP,
		),
		transform: [
			{ scale: interpolate(filterProgress.value, [0, 1], [0.95, 1]) },
		],
	}));

	const accordionStyle = useAnimatedStyle(() => ({
		maxHeight: interpolate(
			accordionProgress.value,
			[0, 1],
			[0, 350],
			Extrapolation.CLAMP,
		),
		opacity: interpolate(
			accordionProgress.value,
			[0, 0.8, 1],
			[0, 0, 1],
			Extrapolation.CLAMP,
		),
		marginTop: interpolate(
			accordionProgress.value,
			[0, 1],
			[0, 8],
			Extrapolation.CLAMP,
		),
	}));

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

	const renderFilterIcon = useCallback(() => {
		const iconColor = Colors[theme].background;
		switch (activeFilterCategory) {
			case "alcoholic":
				return (
					<FontAwesome5 name="cocktail" size={24} color={iconColor} />
				);
			case "category":
				return (
					<MaterialIcons
						name="category"
						size={24}
						color={iconColor}
					/>
				);
			case "ingredient":
				return (
					<FontAwesome6 name="lemon" size={24} color={iconColor} />
				);
			case "glass":
				return (
					<FontAwesome5
						name="glass-whiskey"
						size={24}
						color={iconColor}
					/>
				);
			default:
				return <Ionicons name="filter" size={24} color={iconColor} />;
		}
	}, [activeFilterCategory, theme]);

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

	const listContentStyle = useMemo(
		() => ({
			paddingBottom:
				insets.bottom + 16 + (Platform.OS === "ios" ? 100 : 120),
			marginHorizontal: 16,
			flexGrow: 1,
		}),
		[insets.bottom],
	);

	const keyExtractor = useCallback(
		(item: Cocktail, index: number) =>
			item?.idDrink ? item.idDrink : `skeleton-${index}`,
		[],
	);

	const sortedCocktails = useMemo(() => {
		if (!cocktails) return [];

		return [...cocktails].sort((a, b) => {
			if (isAscending) {
				return a.strDrink.localeCompare(b.strDrink);
			} else {
				return b.strDrink.localeCompare(a.strDrink);
			}
		});
	}, [cocktails, isAscending]);

	const listData = useMemo(() => {
		if (loading && sortedCocktails.length === 0 && letterIndex === 0) {
			return Array(4).fill(null) as any[];
		}
		return sortedCocktails;
	}, [loading, sortedCocktails, letterIndex]);

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

	const renderFooter = () => {
		if (!loading || letterIndex === 0) return null;
		return (
			<View style={styles.footerLoader}>
				<ActivityIndicator size="large" color={Colors[theme].tint} />
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

				<Button
					label={isAscending ? "A-Z" : "Z-A"}
					onPress={() => setIsAscending((prev) => !prev)}
					IconLeft={() => (
						<FontAwesome6
							name={
								isAscending ? "arrow-down-a-z" : "arrow-up-a-z"
							}
							size={18}
							color={Colors[theme].background}
						/>
					)}
					backgroundColor={Colors[theme].tint}
					labelColor={Colors[theme].background}
				/>
			</View>

			<View style={styles.actionsWrapper}>
				<View style={styles.actionsRow}>
					<Animated.View
						style={[
							styles.baseLayout,
							{
								backgroundColor: Colors[theme].tint,
								borderTopLeftRadius: 50,
								borderBottomLeftRadius: 50,
							},
							searchBaseStyle,
						]}>
						<Animated.View
							style={[
								styles.absoluteCenterRow,
								inactiveSearchRowStyle,
							]}
							pointerEvents={isSearchActive ? "none" : "auto"}>
							<Pressable
								onPress={openSearch}
								disabled={isFilterActive}
								style={styles.pressableRow}>
								<Entypo
									name="magnifying-glass"
									size={24}
									color={Colors[theme].background}
								/>
								<Text
									style={[
										styles.actionText,
										{ color: Colors[theme].background },
									]}>
									Cerca
								</Text>
							</Pressable>
						</Animated.View>

						<Animated.View
							style={[styles.activeRow, activeSearchRowStyle]}
							pointerEvents={isSearchActive ? "auto" : "none"}>
							<Entypo
								name="magnifying-glass"
								size={24}
								color={Colors[theme].background}
							/>
							<TextInput
								ref={inputRef}
								style={[
									styles.searchInput,
									{ color: Colors[theme].background },
								]}
								placeholder="Cerca cocktail..."
								placeholderTextColor={
									Colors[theme].background + "80"
								}
								value={searchText}
								onChangeText={handleSearchChange}
								selectionColor={Colors[theme].background}
							/>
							<Pressable
								onPress={closeSearch}
								style={styles.iconButton}>
								<Ionicons
									name="close"
									size={24}
									color={Colors[theme].background}
								/>
							</Pressable>
						</Animated.View>
					</Animated.View>

					<Animated.View
						style={[
							styles.baseLayout,
							{
								backgroundColor: Colors[theme].tint,
								borderTopRightRadius: 50,
								borderBottomRightRadius: 50,
							},
							filterContainerStyle,
						]}>
						<Animated.View
							style={[
								styles.absoluteCenterRow,
								inactiveFilterRowStyle,
							]}
							pointerEvents={isFilterActive ? "none" : "auto"}>
							<Pressable
								onPress={openFilter}
								disabled={isSearchActive}
								style={styles.pressableRow}>
								<Ionicons
									name="filter"
									size={24}
									color={Colors[theme].background}
								/>
								<Text
									style={[
										styles.actionText,
										{ color: Colors[theme].background },
									]}>
									Filtra
								</Text>
							</Pressable>
						</Animated.View>

						<Animated.View
							style={[styles.activeRow, activeFilterRowStyle]}
							pointerEvents={isFilterActive ? "auto" : "none"}>
							<Pressable
								onPress={toggleAccordion}
								style={styles.activeFilterRow}>
								{renderFilterIcon()}

								<Text
									numberOfLines={1}
									style={[
										styles.actionText,
										styles.activeFilterText,
										{ color: Colors[theme].background },
									]}>
									{selectedFilterValue
										? selectedFilterValue
										: "Seleziona filtro..."}
								</Text>
							</Pressable>

							<Pressable
								onPress={closeFilter}
								style={styles.iconButton}>
								<Ionicons
									name="close"
									size={24}
									color={Colors[theme].background}
								/>
							</Pressable>
						</Animated.View>
					</Animated.View>
				</View>

				<Animated.View
					style={[
						styles.accordionContainer,
						{ backgroundColor: Colors[theme].tint },
						accordionStyle,
					]}>
					{renderAccordionContent()}
				</Animated.View>
			</View>

			<Animated.FlatList
				data={listData}
				contentContainerStyle={listContentStyle}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				ListEmptyComponent={EmptyFavorites}
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
	actionsWrapper: {
		marginBottom: 16,
		marginHorizontal: 16,
	},
	actionsRow: {
		flexDirection: "row",
	},
	baseLayout: {
		height: 48,
		justifyContent: "center",
		overflow: "hidden",
	},
	absoluteCenterRow: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 12,
	},
	activeRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 12,
	},
	activeFilterRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	pressableRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		width: "100%",
		height: "100%",
	},
	activeFilterText: {
		flex: 1,
		textAlign: "left",
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		padding: 0,
		height: "100%",
	},
	iconButton: {
		padding: 4,
		marginRight: -4,
	},
	actionText: {
		fontSize: 16,
	},
	accordionContainer: {
		borderRadius: 16,
		overflow: "hidden",
	},
	accordionOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
	},
	accordionScroll: {
		maxHeight: 350,
	},
	accordionText: {
		fontSize: 16,
	},
	backOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
		gap: 8,
		backgroundColor: "rgba(0,0,0,0.1)",
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
