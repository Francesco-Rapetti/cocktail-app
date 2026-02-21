import Constants from "expo-constants";
import { useCallback, useMemo } from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import Animated, {
	FadeIn,
	FadeOutLeft,
	LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Card from "@/components/UI/Card/Card";
import { Text, View } from "@/components/UI/Themed";
import { useAppStore } from "@/stores/AppStore";
import { useRouter } from "expo-router";

const EmptyFavorites = () => (
	<Animated.View
		entering={FadeIn.duration(400).delay(200)}
		style={styles.emptyContainer}>
		<Text style={styles.emptyTitle}>Nessun preferito</Text>
		<Text style={styles.emptySubtitle}>
			Non hai ancora salvato nessun cocktail. Esplora il menu e aggiungi i
			tuoi drink preferiti!
		</Text>
	</Animated.View>
);

export default function Favourites() {
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const favorites = useAppStore((state) => state.favorites);
	const toggleFavorite = useAppStore((state) => state.toggleFavorite);

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

	const renderItem = useCallback(
		({ item }: { item: any }) => (
			<Animated.View
				key={item.idDrink}
				exiting={FadeOutLeft.duration(300)}
				style={{ marginBottom: 24 }}>
				<Card
					uri={item.strDrinkThumb}
					title={item.strDrink}
					drinkId={item.idDrink}
					onFavouritePress={() => handleToggleFavorite(item)}
					onPress={() => {
						router.push({
							pathname: "/cocktailDetail",
							params: { id: item.idDrink },
						});
					}}
				/>
			</Animated.View>
		),
		[handleToggleFavorite],
	);

	const keyExtractor = useCallback(
		(item: any) => item.idDrink.toString(),
		[],
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

	return (
		<View
			style={[
				styles.container,
				{ paddingTop: Constants.statusBarHeight + 10 },
			]}>
			<Text maxFontSizeMultiplier={1} style={styles.title}>
				I miei preferiti
			</Text>

			<Animated.FlatList
				data={favorites}
				contentContainerStyle={listContentStyle}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				ListEmptyComponent={EmptyFavorites}
				itemLayoutAnimation={LinearTransition.springify()}
				removeClippedSubviews={false}
				initialNumToRender={10}
				maxToRenderPerBatch={5}
				windowSize={11}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 6,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 16,
		marginHorizontal: 16,
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
});
