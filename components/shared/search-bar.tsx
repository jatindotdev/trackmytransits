import { Cross, Search, X } from '@tamagui/lucide-icons';
import { Button, Input, View } from 'tamagui';

export interface SearchBarProps extends React.ComponentProps<typeof View> {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onClear,
  ...props
}) => {
  return (
    <View
      bg="$background"
      w="100%"
      fd="row"
      ai="center"
      px="$3"
      py="$1"
      gap="$2"
      {...props}
    >
      <Search size={20} color="$placeholderColor" />
      <Input
        flex={1}
        fontSize="$5"
        placeholder={placeholder}
        borderWidth="$0"
        value={value}
        onChangeText={onChange}
        m="$0"
        p="$0"
      />
      {!!value && (
        <X
          size={26}
          color="$placeholderColor"
          hitSlop={{
            bottom: 40,
            left: 40,
            right: 40,
            top: 40,
          }}
          onPress={onClear}
        />
      )}
    </View>
  );
};