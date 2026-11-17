// /datenschutz (Paket C, Vorlage „Lesen“): Rechtstext wortlich aus src/inhalt/datenschutz.js, mit Verzeichnis der Abschnitte.
import { rechtsseite } from './impressum-datenschutz.js';
import * as D from '../inhalt/datenschutz.js';

rechtsseite(D, { inhaltsverzeichnis: true });
