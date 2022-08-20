import {
  AudioFeatures,
  PlaylistTrack,
  TrackSeed,
} from "../../server/router/output-types";

export const INITIAL_AUDIO_FEATURES: Partial<AudioFeatures> = {
  danceability: undefined,
  instrumentalness: undefined,
  valence: undefined,
  energy: undefined,
};

export type UserInput = {
  trackSeeds: TrackSeed[];
  audioFeatures: {
    danceability?: number;
    valence?: number;
    energy?: number;
    instrumentalness?: number;
  };
  playlistTracks: PlaylistTrack[];
};

export enum UserActionType {
  SELECT_TRACK,
  UNSELECT_TRACK,
  MODIFY_AUDIO_FEATURES,
  UPDATE_PLAYLIST,
  REMOVE_TRACK,
  ADD_TRACK,
}

export type UserAction =
  | {
      type: UserActionType.SELECT_TRACK | UserActionType.UNSELECT_TRACK;
      payload: TrackSeed;
    }
  | {
      type: UserActionType.MODIFY_AUDIO_FEATURES;
      payload: {
        danceability: number;
        valence: number;
        energy: number;
        instrumentalness: number;
      };
    }
  | {
      type: UserActionType.UPDATE_PLAYLIST;
      payload: PlaylistTrack[];
    }
  | {
      type: UserActionType.REMOVE_TRACK | UserActionType.ADD_TRACK;
      payload: PlaylistTrack;
    };

export function userInputReducer(state: UserInput, action: UserAction) {
  switch (action.type) {
    case UserActionType.SELECT_TRACK: {
      const index = state.trackSeeds.findIndex(
        (track) => track.id === action.payload.id
      );
      if (index === -1) {
        return {
          ...state,
          audioFeatures: { ...INITIAL_AUDIO_FEATURES },
          trackSeeds: [...state.trackSeeds, action.payload],
        };
      } else {
        return state;
      }
    }
    case UserActionType.UNSELECT_TRACK: {
      const index = state.trackSeeds.findIndex(
        (track) => track.id === action.payload.id
      );
      if (index > -1) {
        state.trackSeeds.splice(index, 1);
        return {
          ...state,
          audioFeatures: { ...INITIAL_AUDIO_FEATURES },
          trackSeeds: [...state.trackSeeds],
        };
      } else {
        return state;
      }
    }
    case UserActionType.MODIFY_AUDIO_FEATURES: {
      return {
        ...state,
        audioFeatures: { ...action.payload },
      };
    }
    case UserActionType.UPDATE_PLAYLIST: {
      return {
        ...state,
        playlistTracks: [...action.payload],
      };
    }
    case UserActionType.REMOVE_TRACK: {
      const index = state.playlistTracks.findIndex(
        (track) => track.id === action.payload.id
      );
      if (index > -1) {
        state.playlistTracks.splice(index, 1);
        return {
          ...state,
          playlistTracks: [...state.playlistTracks],
        };
      } else {
        return state;
      }
    }
    case UserActionType.ADD_TRACK: {
      const index = state.playlistTracks.findIndex(
        (track) => track.id === action.payload.id
      );
      if (index === -1) {
        return {
          ...state,
          playlistTracks: [...state.playlistTracks, action.payload],
        };
      } else {
        return state;
      }
    }
    default: {
      return state;
    }
  }
}
