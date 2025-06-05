import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertTriangle" className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold text-surface-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
          <p className="text-surface-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound