export const ErrorMessage = {
  NOT_VALID_FORMAT: '잘못된 형식의 요청입니다.',
  NOT_EMAIL_FORMAT: '잘못된 이메일 형식입니다.',
  NOT_FOUND_USER: '해당하는 유저를 찾을 수 없습니다',
  NOT_FOUND_ESSENTIAL: '필수 항목이 누락되었습니다',
  DUPLICATED_USER_ID: '이미 존재하는 ID입니다.',
  DUPLICATED_WISH: '이미 추가된 항목입니다.',
  NEED_ONE_SEARCH_CONDITION: '검색 조건이 하나 이상 존재해야 합니다.',
  EXCEED_ONE_SEARCH_CONDITION: '검색 조건은 하나만 가능합니다.',
  EXCEED_USER_LOCATION_LIMIT: '관심 지역은 최대 2개까지 설정 가능합니다.',
  NOT_EMPTY_USER_LOCATION: '관심 지역은 최소 1개 설정되어야 합니다.',
  NOT_FOUND_TARGET: (target: string) => `존재하지 않는 ${target}입니다.`,
};