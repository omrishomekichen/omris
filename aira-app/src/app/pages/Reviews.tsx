import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';

import {
  Star,
  Search,
  X,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react-native';


/* =====================================================
   TYPES
   ===================================================== */

interface Review {
  id: string;
  customerName: string;
  menuItemName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
}


/* =====================================================
   STATIC REVIEW DATA
   ===================================================== */

const REVIEWS: Review[] = [
  {
    id: '1',
    customerName: 'Ananya Sharma',
    menuItemName: 'Mango Pickle',
    rating: 5,
    comment:
      'Amazing traditional taste! Just like homemade pickle. The spice level was perfect.',
    isVerifiedPurchase: true,
  },
  {
    id: '2',
    customerName: 'Rahul Kumar',
    menuItemName: 'Avakaya Pickle',
    rating: 5,
    comment:
      'Excellent quality and authentic Andhra flavour. Will definitely order again.',
    isVerifiedPurchase: true,
  },
  {
    id: '3',
    customerName: 'Priya Reddy',
    menuItemName: 'Gongura Pickle',
    rating: 4,
    comment:
      'Really tasty and fresh. A little spicy for me, but the flavour is excellent.',
    isVerifiedPurchase: true,
  },
  {
    id: '4',
    customerName: 'Karthik Rao',
    menuItemName: 'Garlic Pickle',
    rating: 4,
    comment:
      'Strong garlic flavour and very good texture. Goes perfectly with rice.',
    isVerifiedPurchase: true,
  },
  {
    id: '5',
    customerName: 'Sneha Patel',
    menuItemName: 'Curry Leaf Podi',
    rating: 5,
    comment:
      'The podi is fantastic. Very fresh aroma and perfect with dosa.',
    isVerifiedPurchase: true,
  },
  {
    id: '6',
    customerName: 'Vijay Kumar',
    menuItemName: 'Idli Podi',
    rating: 3,
    comment:
      'Good taste but I expected a little more spice.',
    isVerifiedPurchase: false,
  },
  {
    id: '7',
    customerName: 'Divya Nair',
    menuItemName: 'Lemon Pickle',
    rating: 5,
    comment:
      'Loved the balance of sourness and spice. Highly recommended!',
    isVerifiedPurchase: true,
  },
];


/* =====================================================
   REVIEWS SCREEN
   ===================================================== */

export default function ReviewsScreen() {

  const [selectedRating, setSelectedRating] =
    useState<number | 'all'>('all');

  const [searchQuery, setSearchQuery] =
    useState('');


  /* ===================================================
     FILTER REVIEWS
     =================================================== */

  const filteredReviews = useMemo(() => {

    return REVIEWS.filter(review => {

      if (
        selectedRating !== 'all' &&
        review.rating !== selectedRating
      ) {
        return false;
      }


      if (searchQuery.trim()) {

        const query =
          searchQuery.toLowerCase().trim();

        const matchCustomer =
          review.customerName
            .toLowerCase()
            .includes(query);

        const matchProduct =
          review.menuItemName
            .toLowerCase()
            .includes(query);

        const matchComment =
          review.comment
            .toLowerCase()
            .includes(query);

        if (
          !matchCustomer &&
          !matchProduct &&
          !matchComment
        ) {
          return false;
        }
      }

      return true;
    });

  }, [
    selectedRating,
    searchQuery,
  ]);


  /* ===================================================
     RATING CALCULATIONS
     =================================================== */

  const averageRating =
    (
      REVIEWS.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      ) / (REVIEWS.length || 1)
    ).toFixed(1);


  const verifiedCount =
    REVIEWS.filter(
      review =>
        review.isVerifiedPurchase
    ).length;


  const starCounts = [5, 4, 3, 2, 1].map(
    stars => {

      const count =
        REVIEWS.filter(
          review =>
            review.rating === stars
        ).length;

      const percentage =
        Math.round(
          (count /
            (REVIEWS.length || 1)) *
            100
        );

      return {
        stars,
        count,
        percentage,
      };
    }
  );


  return (

    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >


        {/* =================================================
            HERO CARD
            ================================================= */}

        <View style={styles.heroCard}>

          <View style={styles.heroHeader}>

            <View style={styles.heroText}>

              <Text style={styles.title}>
                Customer Ratings & Praise
              </Text>

              <Text style={styles.subtitle}>
                {verifiedCount} verified customer reviews
              </Text>

            </View>


            {/* SCORE */}

            <View style={styles.scoreBox}>

              <View style={styles.scoreRow}>

                <Text style={styles.score}>
                  {averageRating}
                </Text>

                <Star
                  size={18}
                  color="#f59e0b"
                  fill="#f59e0b"
                />

              </View>

              <Text style={styles.reviewCount}>
                {REVIEWS.length} reviews
              </Text>

            </View>

          </View>


          {/* =================================================
              STAR BREAKDOWN
              ================================================= */}

          <View style={styles.breakdown}>

            {starCounts.map(row => {

              const active =
                selectedRating === row.stars;

              return (

                <Pressable
                  key={row.stars}
                  onPress={() =>
                    setSelectedRating(
                      active
                        ? 'all'
                        : row.stars
                    )
                  }
                  style={styles.ratingRow}
                >

                  <View style={styles.starLabel}>

                    <Text style={styles.starNumber}>
                      {row.stars}
                    </Text>

                    <Star
                      size={10}
                      color="#f59e0b"
                      fill="#f59e0b"
                    />

                  </View>


                  <View
                    style={styles.barBackground}
                  >

                    <View
                      style={[
                        styles.barFill,
                        {
                          width:
                            `${row.percentage}%`,
                        },
                      ]}
                    />

                  </View>


                  <Text style={styles.ratingCount}>
                    {row.count}
                  </Text>

                </Pressable>

              );

            })}

          </View>


          {/* =================================================
              SEARCH
              ================================================= */}

          <View style={styles.searchBox}>

            <Search
              size={16}
              color="#a8a29e"
            />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search feedback, dishes or customers..."
              placeholderTextColor="#a8a29e"
              style={styles.searchInput}
            />

            {searchQuery.length > 0 && (

              <Pressable
                onPress={() =>
                  setSearchQuery('')
                }
              >

                <X
                  size={15}
                  color="#78716c"
                />

              </Pressable>

            )}

          </View>

        </View>


        {/* =================================================
            RATING FILTERS
            ================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >

          {/* ALL */}

          <Pressable
            onPress={() =>
              setSelectedRating('all')
            }
            style={[
              styles.filterButton,

              selectedRating === 'all' &&
                styles.filterActive,
            ]}
          >

            <Text
              style={[
                styles.filterText,

                selectedRating === 'all' &&
                  styles.filterTextActive,
              ]}
            >
              All Reviews
            </Text>

            <View
              style={[
                styles.filterCount,

                selectedRating === 'all' &&
                  styles.filterCountActive,
              ]}
            >

              <Text
                style={[
                  styles.filterCountText,

                  selectedRating === 'all' &&
                    styles.filterCountTextActive,
                ]}
              >
                {REVIEWS.length}
              </Text>

            </View>

          </Pressable>


          {/* STAR FILTERS */}

          {[5, 4, 3, 2, 1].map(stars => {

            const count =
              REVIEWS.filter(
                review =>
                  review.rating === stars
              ).length;

            const active =
              selectedRating === stars;

            return (

              <Pressable
                key={stars}
                onPress={() =>
                  setSelectedRating(stars)
                }
                style={[
                  styles.filterButton,

                  active &&
                    styles.starFilterActive,
                ]}
              >

                <Text
                  style={[
                    styles.filterText,

                    active &&
                      styles.filterTextActive,
                  ]}
                >
                  {stars}
                </Text>

                <Star
                  size={11}
                  color={
                    active
                      ? '#ffffff'
                      : '#f59e0b'
                  }
                  fill={
                    active
                      ? '#ffffff'
                      : '#f59e0b'
                  }
                />

                <Text
                  style={[
                    styles.filterSmallCount,

                    active &&
                      styles.filterTextActive,
                  ]}
                >
                  ({count})
                </Text>

              </Pressable>

            );

          })}

        </ScrollView>


        {/* =================================================
            REVIEW LIST
            ================================================= */}

        <View style={styles.reviewList}>

          {filteredReviews.length === 0 ? (

            <View style={styles.emptyCard}>

              <View style={styles.emptyIcon}>

                <MessageSquare
                  size={24}
                  color="#b45309"
                />

              </View>

              <Text style={styles.emptyTitle}>
                No reviews found
              </Text>

              <Text style={styles.emptyText}>
                Try selecting All Reviews or
                clearing your search.
              </Text>

            </View>

          ) : (

            filteredReviews.map(review => (

              <ReviewCard
                key={review.id}
                review={review}
              />

            ))

          )}

        </View>


        <View style={{ height: 30 }} />

      </ScrollView>

    </View>
  );
}


/* =====================================================
   REVIEW CARD
   ===================================================== */

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<
  ReviewCardProps
> = ({
  review,
}) => {

  return (

    <View style={styles.reviewCard}>

      {/* HEADER */}

      <View style={styles.reviewHeader}>

        <View style={styles.customerAvatar}>

          <Text style={styles.avatarText}>
            {review.customerName
              .split(' ')
              .map(name => name[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Text>

        </View>


        <View style={styles.customerInfo}>

          <Text style={styles.customerName}>
            {review.customerName}
          </Text>

          <Text style={styles.productName}>
            {review.menuItemName}
          </Text>

        </View>


        <View style={styles.ratingBox}>

          <Text style={styles.ratingNumber}>
            {review.rating}
          </Text>

          <Star
            size={12}
            color="#f59e0b"
            fill="#f59e0b"
          />

        </View>

      </View>


      {/* STARS */}

      <View style={styles.starsRow}>

        {[1, 2, 3, 4, 5].map(star => (

          <Star
            key={star}
            size={13}
            color="#f59e0b"
            fill={
              star <= review.rating
                ? '#f59e0b'
                : 'transparent'
            }
          />

        ))}

      </View>


      {/* COMMENT */}

      <View style={styles.commentBox}>

        <Text style={styles.comment}>
          "{review.comment}"
        </Text>

      </View>


      {/* FOOTER */}

      <View style={styles.reviewFooter}>

        {review.isVerifiedPurchase && (

          <View style={styles.verifiedBadge}>

            <CheckCircle2
              size={12}
              color="#166534"
            />

            <Text style={styles.verifiedText}>
              Verified Purchase
            </Text>

          </View>

        )}

        <Text style={styles.reviewProduct}>
          {review.menuItemName}
        </Text>

      </View>

    </View>
  );
};


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  content: {
    padding: 12,
    paddingBottom: 30,
  },


  /* HERO */

  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    padding: 14,
    elevation: 1,
    marginBottom: 9,
  },

  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  heroText: {
    flex: 1,
  },

  title: {
    color: '#1c1917',
    fontSize: 18,
    fontWeight: '800',
  },

  subtitle: {
    color: '#78716c',
    fontSize: 10,
    marginTop: 4,
  },


  /* SCORE */

  scoreBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 11,
    paddingVertical: 9,
    alignItems: 'center',
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  score: {
    color: '#451a03',
    fontSize: 23,
    fontWeight: '900',
  },

  reviewCount: {
    color: '#92400e',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },


  /* BREAKDOWN */

  breakdown: {
    borderTopWidth: 1,
    borderTopColor: '#f5f5f4',
    marginTop: 15,
    paddingTop: 12,
    gap: 7,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  starLabel: {
    width: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  starNumber: {
    color: '#57534e',
    fontSize: 9,
    fontWeight: '800',
  },

  barBackground: {
    flex: 1,
    height: 7,
    backgroundColor: '#f5f5f4',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 10,
  },

  ratingCount: {
    width: 20,
    textAlign: 'right',
    color: '#a8a29e',
    fontSize: 9,
    fontWeight: '800',
  },


  /* SEARCH */

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    backgroundColor: '#fafaf9',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 14,
    paddingHorizontal: 11,
    marginTop: 14,
  },

  searchInput: {
    flex: 1,
    color: '#1c1917',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },


  /* FILTERS */

  filterContainer: {
    gap: 7,
    paddingBottom: 10,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },

  filterActive: {
    backgroundColor: '#650700',
    borderColor: '#650700',
  },

  starFilterActive: {
    backgroundColor: '#b45309',
    borderColor: '#b45309',
  },

  filterText: {
    color: '#57534e',
    fontSize: 9,
    fontWeight: '800',
  },

  filterTextActive: {
    color: '#ffffff',
  },

  filterCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f5f5f4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  filterCountText: {
    color: '#57534e',
    fontSize: 8,
    fontWeight: '800',
  },

  filterCountTextActive: {
    color: '#ffffff',
  },

  filterSmallCount: {
    color: '#a8a29e',
    fontSize: 8,
    fontWeight: '700',
  },


  /* REVIEWS */

  reviewList: {
    gap: 9,
  },

  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    padding: 13,
    elevation: 1,
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#650700',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    color: '#1c1917',
    fontSize: 11,
    fontWeight: '800',
  },

  productName: {
    color: '#a8a29e',
    fontSize: 8,
    marginTop: 3,
    fontWeight: '600',
  },

  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
  },

  ratingNumber: {
    color: '#92400e',
    fontSize: 9,
    fontWeight: '900',
  },


  /* STARS */

  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 11,
  },


  /* COMMENT */

  commentBox: {
    backgroundColor: '#fafaf9',
    borderRadius: 12,
    padding: 10,
    marginTop: 9,
  },

  comment: {
    color: '#57534e',
    fontSize: 10,
    lineHeight: 16,
    fontStyle: 'italic',
  },


  /* FOOTER */

  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
  },

  verifiedText: {
    color: '#166534',
    fontSize: 8,
    fontWeight: '800',
  },

  reviewProduct: {
    color: '#a8a29e',
    fontSize: 8,
    fontWeight: '600',
  },


  /* EMPTY */

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    padding: 40,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  emptyTitle: {
    color: '#1c1917',
    fontSize: 13,
    fontWeight: '800',
  },

  emptyText: {
    color: '#78716c',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 5,
  },

});