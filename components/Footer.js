import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GJTS Karnataka</h3>
            <p className="text-gray-400 mb-4">
              Empowering students with quality technical education across Karnataka
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/admissions" className="text-gray-400 hover:text-white">Admissions</Link></li>
              <li><Link href="/schools" className="text-gray-400 hover:text-white">Our Schools</Link></li>
              <li><Link href="/alumni" className="text-gray-400 hover:text-white">Alumni</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Schools</h3>
            <ul className="space-y-2">
              <li><Link href="/schools/ballari" className="text-gray-400 hover:text-white">GJTS Ballari</Link></li>
              <li><Link href="/schools/bhadravati" className="text-gray-400 hover:text-white">GJTS Bhadravati</Link></li>
              <li><Link href="/schools/hubballi" className="text-gray-400 hover:text-white">GJTS Hubballi</Link></li>
              <li><Link href="/schools/bagalkot" className="text-gray-400 hover:text-white">GJTS Bagalkot</Link></li>
              <li><Link href="/schools/kalburgi" className="text-gray-400 hover:text-white">GJTS Kalburgi</Link></li>
              <li><Link href="/schools/mangalore" className="text-gray-400 hover:text-white">GJTS Mangalore</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-primary-500" />
                <span className="text-gray-400">Karnataka, India</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-primary-500" />
                <span className="text-gray-400">080-XXXX-XXXX</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary-500" />
                <span className="text-gray-400">info@gjtskarnataka.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Government Junior Technical Schools Karnataka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
