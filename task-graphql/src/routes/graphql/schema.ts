import { buildSchema } from 'graphql';

export const schema = buildSchema(`
		type User {
			id: ID!
			name: String!
			balance: Float!

			profile: Profile 
			posts: [Post!]!
			userSubscribedTo: [User!]!
  		subscribedToUser: [User!]!
		}

		type Post {
			id: ID!
			title: String!
			content: String!
			authorId: String!

			author: User
		}

		type Profile {
			id: ID!
			isMale: Boolean!
			yearOfBirth: Int!
			userId: String!
			memberTypeId: String!

			user: User
			memberType: MemberType!
  	}

		type MemberType {
			id: ID!
			discount: Float!
			postsLimitPerMonth: Int!

			profiles: [Profile!]!
		}
			
		type Query {
			users: [User!]!
			user(id: ID!): User

			posts: [Post!]!
			post(id: ID!): Post

			profiles: [Profile!]!
			profile(id: ID!): Profile

			memberTypes: [MemberType!]!
			memberType(id: ID!): MemberType
		}

		type Mutation {
			createUser(dto: CreateUserInput!): User! 
			createPost(dto: CreatePostInput!): Post!
			createProfile(dto: CreateProfileInput!): Profile!

			changeUser(id: ID!, dto:ChangeUserInput): User!
			changePost(id: ID!, dto:ChangePostInput): Post!
			changeProfile(id: ID!, dto:ChangeProfileInput): Profile!

			deleteUser(id: ID!):String!
			deletePost(id:ID!):String!
			deleteProfile(id:ID!):String!

			subscribeTo(userId: ID!, authorId: ID!): String!
			unsubscribeFrom(userId: ID!, authorId: ID!): String!
		}

		input CreateUserInput {
			name: String!
			balance: Float!
		}

		input ChangeUserInput {
			name: String
			balance: Float
		}

		input CreatePostInput {
			title: String!
			content: String!
			authorId: String!
  	}

		input ChangePostInput {
			title: String,
			content: String,
			authorId: String
		}

		input CreateProfileInput {
			isMale: Boolean!
			yearOfBirth: Int!
			userId: String!
			memberTypeId: String!
  	}
		
		input ChangeProfileInput {
			isMale: Boolean,
			yearOfBirth: Int,
			memberTypeId: String
		}
	`);
