import Pressable from "@/components/UI/Pressable";
import { Text } from "@/components/UI/Themed";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export interface FilterOption {
	id: string;
	label: string;
	icon: React.ReactNode;
	data: string[];
}

interface SearchAndFilterBarProps {
	colors: { tint: string; background: string; [key: string]: any };
	searchValue: string;
	onSearchChange: (text: string) => void;
	onSearchClear: () => void;
	filterOptions: FilterOption[];
	selectedFilterValue: string | null;
	onFilterSelect: (categoryId: string, value: string) => void;
	onFilterClear: () => void;
}

export default function SearchAndFilterBar({
	colors,
	searchValue,
	onSearchChange,
	onSearchClear,
	filterOptions,
	selectedFilterValue,
	onFilterSelect,
	onFilterClear,
}: SearchAndFilterBarProps) {
	const inputRef = useRef<TextInput>(null);

	const [isSearchActive, setIsSearchActive] = useState(false);
	const [isFilterActive, setIsFilterActive] = useState(false);
	const [activeFilterCategory, setActiveFilterCategory] = useState<
		string | null
	>(null);

	const searchProgress = useSharedValue(0);
	const filterProgress = useSharedValue(0);
	const accordionProgress = useSharedValue(0);

	const openSearch = useCallback(() => {
		setIsSearchActive(true);
		searchProgress.value = withTiming(1, { duration: 500 });
		setTimeout(() => inputRef.current?.focus(), 50);
	}, [searchProgress]);

	const closeSearch = useCallback(() => {
		inputRef.current?.blur();
		setIsSearchActive(false);
		onSearchClear();
		searchProgress.value = withTiming(0, { duration: 500 });
	}, [searchProgress, onSearchClear]);

	const openFilter = useCallback(() => {
		setIsFilterActive(true);
		setActiveFilterCategory(null);
		filterProgress.value = withTiming(1, { duration: 500 });
		accordionProgress.value = withTiming(1, { duration: 500 });
	}, [filterProgress, accordionProgress]);

	const closeFilter = useCallback(() => {
		setIsFilterActive(false);
		setActiveFilterCategory(null);
		onFilterClear();
		filterProgress.value = withTiming(0, { duration: 500 });
		accordionProgress.value = withTiming(0, { duration: 500 });
	}, [filterProgress, accordionProgress, onFilterClear]);

	const toggleAccordion = useCallback(() => {
		accordionProgress.value = withTiming(
			accordionProgress.value === 0 ? 1 : 0,
			{ duration: 400 },
		);
	}, [accordionProgress]);

	const handleSelectSubCategory = useCallback(
		(value: string) => {
			accordionProgress.value = withTiming(0, { duration: 400 });
			if (activeFilterCategory) {
				onFilterSelect(activeFilterCategory, value);
			}
		},
		[activeFilterCategory, onFilterSelect, accordionProgress],
	);

	const activeFilterConfig = filterOptions.find(
		(opt) => opt.id === activeFilterCategory,
	);

	const renderAccordionContent = () => {
		if (!activeFilterCategory) {
			return filterOptions.map((option, index) => (
				<Pressable
					key={option.id}
					style={[
						styles.accordionOption,
						index !== filterOptions.length - 1 && {
							borderBottomWidth: 1,
							borderBottomColor: colors.background + "20",
						},
					]}
					onPress={() => setActiveFilterCategory(option.id)}>
					<Text
						style={[
							styles.accordionText,
							{ color: colors.background },
						]}>
						{option.label}
					</Text>
					<MaterialIcons
						name="chevron-right"
						size={20}
						color={colors.background}
					/>
				</Pressable>
			));
		}

		const data = activeFilterConfig?.data || [];

		return (
			<ScrollView style={styles.accordionScroll} nestedScrollEnabled>
				<Pressable
					style={styles.backOption}
					onPress={() => setActiveFilterCategory(null)}>
					<MaterialIcons
						name="arrow-back"
						size={20}
						color={colors.background}
					/>
					<Text
						style={[
							styles.accordionText,
							{ color: colors.background, fontWeight: "bold" },
						]}>
						Indietro
					</Text>
				</Pressable>
				{data.map((item, index) => (
					<Pressable
						key={`${activeFilterCategory}-${index}`}
						style={[
							styles.accordionOption,
							{
								borderBottomWidth: 1,
								borderBottomColor: colors.background + "10",
							},
						]}
						onPress={() => handleSelectSubCategory(item)}>
						<Text
							style={[
								styles.accordionText,
								{ color: colors.background },
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

	return (
		<View style={styles.actionsWrapper}>
			<View style={styles.actionsRow}>
				<Animated.View
					style={[
						styles.baseLayout,
						{
							backgroundColor: colors.tint,
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
								color={colors.background}
							/>
							<Text
								style={[
									styles.actionText,
									{ color: colors.background },
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
							color={colors.background}
						/>
						<TextInput
							ref={inputRef}
							style={[
								styles.searchInput,
								{ color: colors.background },
							]}
							placeholder="Cerca cocktail..."
							placeholderTextColor={colors.background + "80"}
							value={searchValue}
							onChangeText={onSearchChange}
							selectionColor={colors.background}
						/>
						<Pressable
							onPress={closeSearch}
							style={styles.iconButton}>
							<Ionicons
								name="close"
								size={24}
								color={colors.background}
							/>
						</Pressable>
					</Animated.View>
				</Animated.View>

				<Animated.View
					style={[
						styles.baseLayout,
						{
							backgroundColor: colors.tint,
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
								color={colors.background}
							/>
							<Text
								style={[
									styles.actionText,
									{ color: colors.background },
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
							{activeFilterConfig?.icon || (
								<Ionicons
									name="filter"
									size={24}
									color={colors.background}
								/>
							)}
							<Text
								numberOfLines={1}
								style={[
									styles.actionText,
									styles.activeFilterText,
									{ color: colors.background },
								]}>
								{selectedFilterValue
									? selectedFilterValue
									: "Seleziona..."}
							</Text>
						</Pressable>

						<Pressable
							onPress={closeFilter}
							style={styles.iconButton}>
							<Ionicons
								name="close"
								size={24}
								color={colors.background}
							/>
						</Pressable>
					</Animated.View>
				</Animated.View>
			</View>

			<Animated.View
				style={[
					styles.accordionContainer,
					{ backgroundColor: colors.tint },
					accordionStyle,
				]}>
				{renderAccordionContent()}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	actionsWrapper: { marginBottom: 16, marginHorizontal: 16 },
	actionsRow: { flexDirection: "row" },
	baseLayout: { height: 48, justifyContent: "center", overflow: "hidden" },
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
	activeFilterText: { flex: 1, textAlign: "left" },
	searchInput: { flex: 1, fontSize: 16, padding: 0, height: "100%" },
	iconButton: { padding: 4, marginRight: -4 },
	actionText: { fontSize: 16 },
	accordionContainer: { borderRadius: 16, overflow: "hidden" },
	accordionOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
	},
	accordionScroll: { maxHeight: 350 },
	accordionText: { fontSize: 16 },
	backOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
		gap: 8,
		backgroundColor: "rgba(0,0,0,0.1)",
	},
});
