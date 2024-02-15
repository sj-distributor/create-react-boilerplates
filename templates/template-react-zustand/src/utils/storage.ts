export async function loadString(key: string): Promise<string | null> {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    // todo log error
    return null;
  }
}

export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    localStorage.setItem(key, value);

    return true;
  } catch (error) {
    // todo log error
    return false;
  }
}

export async function load(key: string): Promise<any | null> {
  try {
    const almostThere = localStorage.getItem(key);

    return JSON.parse(almostThere as string);
  } catch (error) {
    // todo log error
    return null;
  }
}

export async function save(key: string, value: any): Promise<boolean> {
  try {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (error) {
    // todo log error
    return false;
  }
}

export async function remove(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // todo log error
  }
}

export async function clear(): Promise<void> {
  try {
    localStorage.clear();
  } catch (error) {
    // todo log error
  }
}
