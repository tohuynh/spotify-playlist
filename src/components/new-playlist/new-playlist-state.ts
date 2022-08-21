import {
  AudioFeatures,
  PlaylistTrack,
  TrackSeed,
} from "../../server/router/output-types";

export const INITIAL_AUDIO_FEATURES: Partial<AudioFeatures> = {
  danceability: undefined,
  tempo: undefined,
  valence: undefined,
  energy: undefined,
};

export type UserInput = {
  trackSeeds: TrackSeed[];
  audioFeatures: Partial<AudioFeatures>;
  playlistTracks: PlaylistTrack[];
  hasNewTrackSeeds: boolean;
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
      payload: AudioFeatures;
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
      const trackSeeds = state.trackSeeds;
      if (index === -1) {
        trackSeeds.push(action.payload);
      }
      return {
        ...state,
        audioFeatures: { ...INITIAL_AUDIO_FEATURES },
        trackSeeds: [...trackSeeds],
        hasNewTrackSeeds: true,
      };
    }
    case UserActionType.UNSELECT_TRACK: {
      const index = state.trackSeeds.findIndex(
        (track) => track.id === action.payload.id
      );
      if (index > -1) {
        state.trackSeeds.splice(index, 1);
      }
      return {
        ...state,
        audioFeatures: { ...INITIAL_AUDIO_FEATURES },
        trackSeeds: [...state.trackSeeds],
        hasNewTrackSeeds: true,
      };
    }
    case UserActionType.MODIFY_AUDIO_FEATURES: {
      return {
        ...state,
        audioFeatures: { ...action.payload },
        hasNewTrackSeeds: false,
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
      }
      return {
        ...state,
        playlistTracks: [...state.playlistTracks],
      };
    }
    case UserActionType.ADD_TRACK: {
      const index = state.playlistTracks.findIndex(
        (track) => track.id === action.payload.id
      );
      const playlistTracks = state.playlistTracks;
      if (index === -1) {
        playlistTracks.unshift(action.payload);
      }
      return {
        ...state,
        playlistTracks: [...playlistTracks],
      };
    }
    default: {
      return state;
    }
  }
}
