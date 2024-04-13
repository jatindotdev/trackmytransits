import * as FileSystem from 'expo-file-system';

export const formatTime = (time: number | Date | undefined) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(time);
};

const cacheDirectory = `${FileSystem.cacheDirectory}transits/`;

async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(cacheDirectory);
  if (!dirInfo.exists) {
    console.log("Gif directory doesn't exist, creating…");
    await FileSystem.makeDirectoryAsync(cacheDirectory, {
      intermediates: true,
    });
  }
}

export async function downloadCSV(data: string, name: string) {
  await ensureDirExists();

  const path = `${cacheDirectory}${name}`;
  await FileSystem.writeAsStringAsync(path, data, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return path;
}