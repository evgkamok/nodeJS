import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateOrderInput = {
  dishId: Scalars['ID']['input'];
  guestId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type CreateReservationInput = {
  customerName: Scalars['String']['input'];
  customerPhone: Scalars['String']['input'];
  guestCount: Scalars['Int']['input'];
  reservationDate: Scalars['String']['input'];
  tableId: Scalars['ID']['input'];
};

export type Dish = {
  __typename?: 'Dish';
  available: Scalars['Boolean']['output'];
  category?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  orders: Array<Order>;
  price: Scalars['Float']['output'];
};

export type Guest = {
  __typename?: 'Guest';
  guestNumber: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  orders: Array<Order>;
  reservation: Reservation;
  subtotal: Scalars['Float']['output'];
};

export type Health = {
  __typename?: 'Health';
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelReservation: Reservation;
  createOrder: Order;
  createReservation: Reservation;
};


export type MutationCancelReservationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateReservationArgs = {
  input: CreateReservationInput;
};

export type Order = {
  __typename?: 'Order';
  dish: Dish;
  guest: Guest;
  id: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  availableTables: Array<Table>;
  availableTablesRaw: Array<Table>;
  dish?: Maybe<Dish>;
  guest: Guest;
  health: Health;
  hello: Scalars['String']['output'];
  menu: Array<Dish>;
  order: Order;
  reservation: Reservation;
  reservations: Array<Reservation>;
  tables: Array<Table>;
};


export type QueryAvailableTablesArgs = {
  date: Scalars['String']['input'];
  guestCount?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAvailableTablesRawArgs = {
  date: Scalars['String']['input'];
  guestCount?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDishArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGuestArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMenuArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrderArgs = {
  id: Scalars['Int']['input'];
};


export type QueryReservationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Reservation = {
  __typename?: 'Reservation';
  customerName: Scalars['String']['output'];
  customerPhone: Scalars['String']['output'];
  guestCount: Scalars['Int']['output'];
  guests: Array<Guest>;
  id: Scalars['Int']['output'];
  reservationDate: Scalars['String']['output'];
  status: ReservationStatus;
  table: Table;
  totalAmount: Scalars['Float']['output'];
};

export enum ReservationStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

export type Table = {
  __typename?: 'Table';
  capacity: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  reservations: Array<Reservation>;
  status: TableStatus;
  tableNumber: Scalars['String']['output'];
};

export enum TableStatus {
  Available = 'AVAILABLE',
  Blocked = 'BLOCKED',
  Occupied = 'OCCUPIED',
  Reserved = 'RESERVED'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateOrderInput: CreateOrderInput;
  CreateReservationInput: CreateReservationInput;
  Dish: ResolverTypeWrapper<Dish>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Guest: ResolverTypeWrapper<Guest>;
  Health: ResolverTypeWrapper<Health>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Order: ResolverTypeWrapper<Order>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Reservation: ResolverTypeWrapper<Reservation>;
  ReservationStatus: ReservationStatus;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Table: ResolverTypeWrapper<Table>;
  TableStatus: TableStatus;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateOrderInput: CreateOrderInput;
  CreateReservationInput: CreateReservationInput;
  Dish: Dish;
  Float: Scalars['Float']['output'];
  Guest: Guest;
  Health: Health;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Order: Order;
  Query: Record<PropertyKey, never>;
  Reservation: Reservation;
  String: Scalars['String']['output'];
  Table: Table;
};

export type DishResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dish'] = ResolversParentTypes['Dish']> = {
  available?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type GuestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Guest'] = ResolversParentTypes['Guest']> = {
  guestNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  reservation?: Resolver<ResolversTypes['Reservation'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type HealthResolvers<ContextType = any, ParentType extends ResolversParentTypes['Health'] = ResolversParentTypes['Health']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  cancelReservation?: Resolver<ResolversTypes['Reservation'], ParentType, ContextType, RequireFields<MutationCancelReservationArgs, 'id'>>;
  createOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createReservation?: Resolver<ResolversTypes['Reservation'], ParentType, ContextType, RequireFields<MutationCreateReservationArgs, 'input'>>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  dish?: Resolver<ResolversTypes['Dish'], ParentType, ContextType>;
  guest?: Resolver<ResolversTypes['Guest'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  availableTables?: Resolver<Array<ResolversTypes['Table']>, ParentType, ContextType, RequireFields<QueryAvailableTablesArgs, 'date'>>;
  availableTablesRaw?: Resolver<Array<ResolversTypes['Table']>, ParentType, ContextType, RequireFields<QueryAvailableTablesRawArgs, 'date'>>;
  dish?: Resolver<Maybe<ResolversTypes['Dish']>, ParentType, ContextType, RequireFields<QueryDishArgs, 'id'>>;
  guest?: Resolver<ResolversTypes['Guest'], ParentType, ContextType, RequireFields<QueryGuestArgs, 'id'>>;
  health?: Resolver<ResolversTypes['Health'], ParentType, ContextType>;
  hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  menu?: Resolver<Array<ResolversTypes['Dish']>, ParentType, ContextType, Partial<QueryMenuArgs>>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<QueryOrderArgs, 'id'>>;
  reservation?: Resolver<ResolversTypes['Reservation'], ParentType, ContextType, Partial<QueryReservationArgs>>;
  reservations?: Resolver<Array<ResolversTypes['Reservation']>, ParentType, ContextType>;
  tables?: Resolver<Array<ResolversTypes['Table']>, ParentType, ContextType>;
};

export type ReservationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reservation'] = ResolversParentTypes['Reservation']> = {
  customerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerPhone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guestCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  guests?: Resolver<Array<ResolversTypes['Guest']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reservationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReservationStatus'], ParentType, ContextType>;
  table?: Resolver<ResolversTypes['Table'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type TableResolvers<ContextType = any, ParentType extends ResolversParentTypes['Table'] = ResolversParentTypes['Table']> = {
  capacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reservations?: Resolver<Array<ResolversTypes['Reservation']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TableStatus'], ParentType, ContextType>;
  tableNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Dish?: DishResolvers<ContextType>;
  Guest?: GuestResolvers<ContextType>;
  Health?: HealthResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reservation?: ReservationResolvers<ContextType>;
  Table?: TableResolvers<ContextType>;
};

